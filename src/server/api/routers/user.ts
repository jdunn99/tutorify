import { z } from "zod";
import {
  router,
  adminProtectedProcedure,
  superUserProtectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { env } from "@/env.mjs";

export const userRouter = router({
  get: adminProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getById: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      return await prisma.user.findUnique({
        where: { id: input.id },
      });
    }),

  getByEmail: adminProtectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      return await prisma.user.findUnique({
        where: { email: input.email },
      });
    }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
        isTutor: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { email, password, name, isTutor } = input;

      const hashed = await bcrypt.hash(password, parseInt(env.SALT_ROUNDS));

      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
          role: isTutor ? "PENDING_TUTOR" : "USER",
        },
      });

      if (!user) throw new Error("Something went wrong");

      // Create account for next-auth.
      await prisma.account.create({
        data: {
          type: "Credentials",
          provider: "Credentials",
          providerAccountId: user.id,
          userId: user.id,
        },
      });
    }),

  // Only a Superuser should be able to change Roles, etc.
  updateRole: superUserProtectedProcedure
    .input(z.object({ role: z.nativeEnum(Role), id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      return await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: input.role,
        },
      });
    }),

  // This endpoint shouldn't really be called ever.
  deleteByID: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      if (input.id === session.user.id) return false;

      await prisma.user.delete({ where: { id: input.id } });
      return true;
    }),
});
