import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProtectedProcedure,
} from "@/server/api/trpc";

export const TutorData = z.object({
  hourlyRate: z.number().nonnegative(),
});

export const availabilityRouter = router({
  // Get all availabilities. @admin
  get: adminProtectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return prisma.availability.findMany();
  }),

  // Get an availability by ID.
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { id } = input;

      const availability = await prisma.availability.findUnique({
        where: { id },
        include: { tutor: true },
      });
    }),

  // Get tutors based on a given Subject. @all
  // Not really useful for now, but will eventually be turned into a method for matching tutors to students.
  getBySubject: publicProcedure
    .input(z.object({ name: z.string().nonempty() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { name } = input;

      const subject = prisma.subject.findFirst({
        where: { name },
        include: { tutors: true },
      });
      if (!subject) throw new Error("Subject not found");

      return subject.tutors;
    }),

  // Convert a regular Profile into a TutorProfile. @admin
  create: adminProtectedProcedure
    .input(z.object({ profileId: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { profileId } = input;

      return await prisma.tutor.create({
        data: {
          profileId,
        },
      });
    }),

  // Update the logged in tutor's information. @self
  update: protectedProcedure
    .input(TutorData.partial())
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { ...data } = input;

      return prisma.tutor.update({
        where: { profileId: session.user.id },
        data,
      });
    }),

  // Update a given tutor by ID. @admin
  // Not really useful just going to have in case there's something an admin would need to change.
  updateById: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid() }).merge(TutorData.partial()))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id, ...data } = input;

      return prisma.tutor.update({ where: { id }, data });
    }),

  // If a tutor deletes their profile. They delete the User object. @self
  // The Tutor object will be deleted via cascading.
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const { session, prisma } = ctx;
    return await prisma.user.delete({ where: { id: session.user.id } });
  }),

  // Used only to have a tutor be unassigned / convert them back to a regular user. @admin
  deleteByID: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      return await prisma.tutor.delete({ where: { id } });
    }),
});
