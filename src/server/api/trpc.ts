import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/server/prisma";

// Context

/*
 * Context used in TRPC router in every request.
 *
 * @see https://trpc.io/docs/context
 */
export async function createTRPCContext({
  req,
  res,
}: CreateNextContextOptions) {
  const session = await getServerAuthSession({ req, res });
  return {
    session,
    prisma,
  };
}

// TRPC Init
import { initTRPC, TRPCError } from "@trpc/server";
import { getServerAuthSession } from "../auth";
import superjson from "superjson";
import { Role } from "@prisma/client";

const trpc = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape }) => shape,
});

// Middleware
//
/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = trpc.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceUserIsAdmin = trpc.middleware(({ ctx, next }) => {
  if (
    !ctx.session ||
    !ctx.session.user ||
    !(ctx.session.user.role === Role.ADMIN ||
    ctx.session.user.role === Role.SUPERUSER)
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceUserIsSuperUser = trpc.middleware(({ ctx, next }) => {
  console.log(ctx.session?.user.role, Role.SUPERUSER);
  if (
    !ctx.session ||
    !ctx.session.user ||
    ctx.session.user.role !== Role.SUPERUSER
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// Exports
export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(enforceUserIsAuthed);
export const adminProtectedProcedure = trpc.procedure.use(enforceUserIsAdmin);
export const superUserProtectedProcedure = trpc.procedure.use(
  enforceUserIsSuperUser
);
