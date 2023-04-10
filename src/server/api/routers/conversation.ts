import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const conversationRouter = router({
  getConversationsForUser: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    return await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: {
              equals: session.user.id,
            },
          },
        },
      },
      include: {
        latestMessage: {
          select: {
            createdAt: true,
            message: true,
          },
        },
        participants: {
          select: {
            id: true,
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });
  }),

  markConversationRead: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id } = input;

      await prisma.participant.updateMany({
        where: { conversationId: id, userId: session.user.id },
        data: { readNewestMessage: true },
      });
    }),
});
