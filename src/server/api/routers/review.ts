import { protectedProcedure, publicProcedure, router } from "@/server/api/trpc";
import type { Review, Tutor, User } from "@prisma/client";
import { z } from "zod";
import { CONVERSATION_SELECT_ARGS } from "./messages";
import { UserNameImage } from "./user";

export type ReviewWithUserData = Review & {
  student: UserNameImage;
};

export const reviewsRouter = router({
  getReviewsForTutor: publicProcedure
    .input(z.object({ id: z.string().cuid(), take: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      return await prisma.review.findMany({
        where: { tutorId: id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        tutorId: z.string().cuid(),
        rating: z.number().nonnegative().min(0).max(5),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { rating, tutorId, message } = input;

      return await prisma.review.create({
        data: {
          message,
          rating,
          tutor: {
            connect: {
              id: tutorId,
            },
          },
          student: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        message: z.string().optional(),
        rating: z.number().nonnegative().min(0).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id, message, rating } = input;

      return await prisma.user.update({
        where: { id: session.user.id },
        data: {
          reviews: {
            update: {
              where: { id },
              data: {
                rating,
                message,
              },
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id } = input;

      return await prisma.user.update({
        where: { id: session.user.id },
        data: {
          reviews: {
            delete: {
              id,
            },
          },
        },
      });
    }),
});
