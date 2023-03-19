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

  autocomplete: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { query } = input;

      return await prisma.subject.findMany({
        where: { name: { contains: query } },
        select: { name: true },
      });
    }),

  // Create a new Subject. @admin
  create: adminProtectedProcedure
    .input(z.object({ name: z.string().nonempty() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { name } = input;

      const subject = await prisma.subject.create({
        data: {
          name,
        },
      });

      console.log(subject);
      return subject;
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
