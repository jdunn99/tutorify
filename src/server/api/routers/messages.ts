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
        orderBy: { createdAt: "desc" },
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
    .input(z.object({ id: z.string().cuid(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id, message } = input;

      const currentMessage = await prisma.message.findUnique({
        where: { id },
        select: { studentId: true, tutorId: true },
      });

      if (!currentMessage) throw new Error();

      // Check if the user trying to update the message is the student or tutor
      if (
        currentMessage.studentId !== session.user.id ||
        currentMessage.tutorId !== session.user.id
      ) {
        throw new Error("You do not have permission to update this message.");
      }

      // Update the message
      return await prisma.message.update({
        where: { id },
        data: { message },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id } = input;

      const currentMessage = await prisma.message.findUnique({
        where: { id },
        select: { studentId: true, tutorId: true },
      });

      // TODO: Sent by check ?

      if (!currentMessage) throw new Error();

      // Check if the user trying to update the message is the student or tutor
      if (
        currentMessage.studentId !== session.user.id ||
        currentMessage.tutorId !== session.user.id
      ) {
        throw new Error("You do not have permission to delete this message.");
      }

      return await prisma.message.delete({
        where: { id },
      });
    }),
});
