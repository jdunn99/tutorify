import { z } from "zod";
import {
  router,
  publicProcedure,
  adminProtectedProcedure,
} from "@/server/api/trpc";
import { CoreSubject } from "@prisma/client";

const coreSubjectMapping = {
  math: "MATH",
  science: "SCIENCE",
  "social studies": "SOCIAL_STUDIES",
  "language arts": "LANGUAGE_ARTS",
};

type SubjectList = {
  coreSubject: CoreSubject;
  subjects: { id: string; name: string }[];
}[];

export const subjectRouter = router({
  // Get all Subjects. @all
  get: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return await prisma.subject.findMany();
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

  getGroupedSubjects: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    return (await prisma.$queryRaw`
          SELECT 
            coreSubject, 
            JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name)) AS subjects 
          FROM 
            Subject 
          GROUP BY 
            coreSubject 
          ORDER BY 
            coreSubject ASC;`) as SubjectList;
  }),

  autocomplete: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { query } = input;

      const lowercase = query.toLowerCase();
      const mapped =
        coreSubjectMapping[lowercase as keyof typeof coreSubjectMapping];
      if (mapped)
        return await prisma.subject.findMany({
          where: { coreSubject: mapped as CoreSubject },
        });

      return await prisma.subject.findMany({
        where: {
          name: { contains: query },
        },
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
          coreSubject: "MATH",
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
