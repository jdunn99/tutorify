import { router } from "@/server/api/trpc";
import { tutorRouter } from "@/server/api/routers/tutor";
import { userRouter } from "./routers/user";
import { availabilityRouter } from "./routers/availability";
import { appointmentRouter } from "./routers/appointment";
import { subjectRouter } from "./routers/subject";

export const appRouter = router({
  availability: availabilityRouter,
  appointment: appointmentRouter,
  subject: subjectRouter,
  tutor: tutorRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
