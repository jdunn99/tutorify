import { protectedProcedure, router } from "@/server/api/trpc";
import type { Message, Session, Tutor } from "@prisma/client";
import { z } from "zod";
import { UserNameImage } from "./user";

export const messagesRouter = router({
  getMessagesForConversation: protectedProcedure
    .input(z.object({ conversationId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { conversationId } = input;

      return await prisma.message.findMany({
        where: {
          conversation: {
            id: conversationId,
            participants: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
        include: {
          sentBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), conversationId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { message, conversationId } = input;

      const result = await prisma.message.create({
        data: {
          conversationId,
          message,
          sentById: session.user.id,
        },
      });

      if (!result) throw new Error("something went wrong");

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          latestMessageId: result.id,
        },
      });

      return result;
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
