import { z } from "zod";
import {
  router,
  publicProcedure,
  adminProtectedProcedure,
} from "@/server/api/trpc";

export const subjectRouter = router({
  // Get all Subjects. @all
  get: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return prisma.subject.findMany();
  }),

  // Get a single Subject by ID. @all
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id } = input;

      return await prisma.subject.findUnique({
        where: { id },
      });
    }),

  // Create a new Subject. @admin
  create: adminProtectedProcedure
    .input(z.object({ name: z.string().nonempty() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { name } = input;

      return await prisma.subject.create({
        data: {
          name,
        },
      });
    }),

  // Update a given Subject by ID. @admin
  updateById: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid(), name: z.string().nonempty() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id, ...data } = input;

      return prisma.subject.update({ where: { id }, data });
    }),

  // Delete a Subject by its ID. @admin
  deleteByID: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      return await prisma.subject.delete({ where: { id } });
    }),
});
