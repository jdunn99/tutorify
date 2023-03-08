import { z } from "zod";
import {
  router,
  publicProcedure,
  adminProtectedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

const AppointmentData = z.object({
  name: z.string().nonempty(),
  tutorId: z.string().cuid(),
  studentId: z.string().cuid().optional(),
  subjectId: z.string().cuid(),
  price: z.number().nonnegative(),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number(),
});

export const appointmentRouter = router({
  // Get all Appointments. @all
  get: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return prisma.appointment.findMany();
  }),

  // Get a single Appointment by ID. @proteced
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { id } = input;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          tutor: true,
          student: true,
        },
      });

      if (!appointment) throw new Error("Not found");

      // Make sure they can query the Appointment.
      const { user } = session;
      const { student, tutor } = appointment;

      if (
        user.id === student.id ||
        user.id === tutor.id ||
        user.role === "ADMIN" ||
        user.role === "SUPERUSER"
      )
        return appointment;

      throw new Error("UNAUTHORIZED");
    }),

  // Create a new Appointment. @admin
  create: protectedProcedure
    .input(AppointmentData)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { name, tutorId, price, duration, startTime, endTime, subjectId } =
        input;

      return await prisma.appointment.create({
        data: {
          name,
          tutor: {
            connect: {
              id: tutorId,
            },
          },
          student: {
            connect: {
              id: session.user.id,
            },
          },
          subject: {
            connect: {
              id: subjectId,
            },
          },
          price,
          duration,
          startTime,
          endTime,
        },
      });
    }),

  // Update a given Appointment by ID. @admin
  // Note: This is only for updating the price, duration, start, and end dates.
  // Changing the Tutor requires more information and will be on a separate route (WIP / TODO)
  updateById: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid() }).merge(AppointmentData.partial()))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id, ...data } = input;

      return prisma.appointment.update({ where: { id }, data });
    }),

  // Reschedule
  // Change the Tutor
  // Cancel Appointment
  // Etc.

  // Delete a Subject by its ID. @admin
  deleteByID: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      return await prisma.subject.delete({ where: { id } });
    }),
});
