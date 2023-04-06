import { protectedProcedure, router } from "@/server/api/trpc";
import { z } from "zod";

export const messagesRouter = router({
  getConversations: protectedProcedure
    .input(z.object({ take: z.number().optional() } || undefined))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

      const { take } = input || {};

      return await prisma.message.findMany({
        distinct: ["tutorId"],
        where: {
          OR: [
            {
              studentId: session.user.id,
            },
            {
              tutorId: session.user.id,
            },
          ],
        },
        take,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          tutor: {
            select: {
              id: true,
              user: {
                select: {
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  getMessagesForConversation: protectedProcedure
    .input(z.object({ partner: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { partner } = input;

      return await prisma.message.findMany({
        where: {
          AND: [{ studentId: session.user.id }, { tutorId: partner }],
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), partner: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { partner, message } = input;

      return await prisma.message.create({
        data: {
          message,
          sentBy: session.user.role === "USER" ? "STUDENT" : "TUTOR",
          student: {
            connect: {
              id: session.user.role === "USER" ? session.user.id : partner,
            },
          },
          tutor: {
            connect: {
              id: session.user.role === "USER" ? partner : session.user.id,
            },
          },
        },
      });
    }),

  edit: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {}),
});
