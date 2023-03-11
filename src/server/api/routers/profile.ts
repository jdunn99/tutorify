import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProtectedProcedure,
} from "@/server/api/trpc";
export const IDInput = z.object({ id: z.string().cuid() });

export const ProfileData = z.object({
  name: z.string(),
  biography: z.string(),
});

/*
 * Handles any API requests regarding a Profile
 */
export const profileRouter = router({
  get: adminProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findMany();
  }),

  getById: publicProcedure.input(IDInput).query(async ({ input, ctx }) => {
    const { prisma } = ctx;

    return await prisma.profile.findUnique({
      where: { id: input.id },
      include: {
        tutorProfile: {
          include: {
            availability: true,
          },
        },
      },
    });
  }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: {
          profile: {
            include: { tutorProfile: { include: { availability: true } } },
          },
        },
      });

      if (!user) throw new Error("User not found");

      return user.profile;
    }),

  create: protectedProcedure
    .input(ProfileData)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      return await prisma.profile.create({
        data: {
          ...input,
          user: { connect: { id: session.user.id } },
        },
      });
    }),

  // Create or Update a Profile in the same method.
  upsertProfile: protectedProcedure
    .input(ProfileData.partial())
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      return await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: input,
        create: {
          name: input.name || session.user.name || "",
          biography: input.biography,
          user: { connect: { id: session.user.id } },
        },
      });
    }),

  updateById: adminProtectedProcedure
    .input(IDInput.merge(ProfileData.partial()))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      return await prisma.profile.update({
        where: { userId: input.id },
        data: {
          name: input.name || "",
          biography: input.biography,
        },
      });
    }),

  // Note: Deleting a profile is equivalent to deleting a User.
  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    const { prisma, session } = ctx;

    try {
      await prisma.user.delete({ where: { id: session.user.id } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }),

  // This endpoint shouldn't really be called ever.
  deleteByID: adminProtectedProcedure
    .input(IDInput)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      if (input.id === session.user.id) return false;

      await prisma.profile.delete({ where: { id: input.id } });
      return true;
    }),
});
