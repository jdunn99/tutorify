import { z } from "zod";
import {
  router,
  adminProtectedProcedure,
  superUserProtectedProcedure,
} from "@/server/api/trpc";
import { Role } from "@prisma/client";
import { IDInput } from "./profile";


/*
 * Handles any API requests regarding a User.
 * Since all data on front-end is based on the Profile and this is handling by NextAuth,
 * User objects are only accessible to an Admin.
 */
export const userRouter = router({
  get: adminProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getById: adminProtectedProcedure
    .input(IDInput)
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

  // Only a Superuser should be able to change Roles, etc.
  updateRole: superUserProtectedProcedure
    .input(IDInput.merge(z.object({ role: z.nativeEnum(Role) })))
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
    .input(IDInput)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      if (input.id === session.user.id) return false;

      await prisma.user.delete({ where: { id: input.id } });
      return true;
    }),
});
