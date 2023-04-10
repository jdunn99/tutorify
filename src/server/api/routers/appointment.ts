import { z } from "zod";
import {
  router,
  publicProcedure,
  adminProtectedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { AppointmentStatus } from "@prisma/client";

const AppointmentData = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty().nullable(),
  tutorId: z.string().cuid(),
  studentId: z.string().cuid().optional(),
  subjectId: z.string().cuid(),
  price: z.number().nonnegative(),
  start: z.date(),
  end: z.date(),
  status: z.nativeEnum(AppointmentStatus),
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

  getUpcomingAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    return await prisma.appointment.findFirst({
      where: {
        status: AppointmentStatus.SCHEDULED,
        start: {
          gt: new Date(),
        },
        studentId: session.user.id,
      },
      orderBy: {
        start: "asc",
      },
      include: {
        tutor: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }),

  getAppointmentsForDay: protectedProcedure
    .input(z.object({ take: z.number().int().optional(), date: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { take, date } = input;

      const day = new Date(date);

      return await prisma.appointment.findMany({
        where: {
          AND: [
            { start: { gte: day } },
            { start: { lt: new Date(day.getTime() + 24 * 60 * 60 * 1000) } },
            { studentId: session.user.id },
          ],
        },
        orderBy: {
          start: "asc",
        },
        include: {
          tutor: {
            select: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        take,
      });
    }),

  getRecentCompletedAppointments: protectedProcedure
    .input(z.object({ take: z.number().int() }).optional())
    .query(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { take } = input || {};

      return await prisma.appointment.findMany({
        where: {
          status: AppointmentStatus.COMPLETED,
          studentId: session.user.id,
        },
        orderBy: {
          end: "desc",
        },
        include: {
          tutor: {
            select: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        take,
      });
    }),

  getCountForMonth: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const result = await prisma.$queryRaw<
      Record<string, Record<string, number>>[]
    >`
SELECT JSON_OBJECTAGG(appointment_day, appointment_count) AS appointments
FROM (
  SELECT DATE(start) AS appointment_day, COUNT(*) AS appointment_count
  FROM Appointment
  WHERE start >= '2023-03-01' AND start < '2023-05-01' AND studentId = ${session.user.id}
  GROUP BY DATE(start)
) AS appointment_summary;`;

    return result[0];
  }),

  // Create a new Appointment
  create: protectedProcedure
    .input(AppointmentData)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { title, tutorId, price, start, end, subjectId, description } =
        input;

      // when we create an appointment we also create a conversation
      await prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: [
                { userId: session.user.id, readNewestMessage: false },
                {
                  userId: tutorId,
                  readNewestMessage: false,
                },
              ],
            },
          },
        },
      });

      return await prisma.appointment.create({
        data: {
          title,
          tutor: {
            connect: {
              userId: tutorId,
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
          start,
          end,
          description,
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
