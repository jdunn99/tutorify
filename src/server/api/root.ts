import { router } from "@/server/api/trpc";
import { profileRouter } from "@/server/api/routers/profile";
import { tutorRouter } from "@/server/api/routers/tutor";
import { userRouter } from "./routers/user";

export const appRouter = router({
  profile: profileRouter,
  tutor: tutorRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
