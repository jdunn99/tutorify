import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProtectedProcedure,
} from "@/server/api/trpc";
import { ApplicationStatus } from "@prisma/client";

const BasicInfo = z.object({
  age: z.number().int().min(18).max(99).default(18),
  phone: z.string().describe("tel").min(10),
  location: z.object({
    address: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1), // enum ?
    zip: z.string().min(5),
    country: z.string().min(1),
  }),
  isWorkAuthorized: z.boolean().describe("checkbox"),
  needsVisaSponsorship: z.boolean().describe("checkbox"),
  hasVisaDependency: z.boolean().describe("checkbox"),
  hasInternetConnection: z.boolean().describe("checkbox"),
  hasTechnicalKnowledge: z.boolean().describe("checkbox"),
  hasMicrophone: z.boolean().describe("checkbox"),
  hasWebcam: z.boolean().describe("checkbox"),
});

const Profile = z.object({
  education: z.object({
    school: z.string().min(1),
    degree: z.string(),
    fieldOfStudy: z.string(),
    yearStarted: z.string().min(4).max(4),
    yearEnded: z.string().optional(),
    monthStarted: z.string(),
    monthEnded: z.string().optional(),
  }),
  employment: z.object({
    title: z.string().nonempty(),
    type: z.string(),
    companyName: z.string().min(1),
    yearStarted: z.string().min(4).max(4),
    yearEnded: z.string().default("Present"),
    monthStarted: z.string(),
    monthEnded: z.string().optional(),
  }),
  headline: z.string(),
  biography: z.string(),
  hourlyRate: z.number().nonnegative(),
});

export const TutorData = z.object({
  hourlyRate: z.number().nonnegative(),
});

export const tutorRouter = router({
  // Get all tutors. @admin
  get: adminProtectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return prisma.tutor.findMany();
  }),

  // Get a single Tutor by ID. @all
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id } = input;

      return await prisma.user.findUnique({
        where: { id },
        include: { tutorProfile: { include: { subjects: true } } },
      });
    }),

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

  getByQuery: publicProcedure
    .input(z.object({ query: z.string().nonempty() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { query } = input;

      return await prisma.tutor.findMany({
        select: {
          id: true,
          headline: true,
          biography: true,
          hourlyRate: true,
          subjects: {
            select: { name: true },
          },
          reviews: true,
          user: {
            select: {
              name: true,
              id: true,
            },
          },
          _count: {
            select: {
              appointments: true,
            },
          },
        },
        where: {
          OR: [
            {
              subjects: {
                some: {
                  name: {
                    contains: query,
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          appointments: {
            _count: "desc",
          },
        },
      });
    }),

  getApplicationProgress: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const { user } = session;

    return await prisma.tutor.findUnique({
      where: { userId: user.id },
      select: { applicationStatus: true },
    });
  }),

  updateApplication: protectedProcedure
    .input(
      z.object({
        applicationStatus: z.nativeEnum(ApplicationStatus),
        subjects: z.string().cuid().array().min(1).max(5).optional(),
        basicInfo: BasicInfo.optional(),
        profile: Profile.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { applicationStatus, subjects, basicInfo, profile } = input;
      const { prisma, session } = ctx;
      const { user } = session;

      const { location, ...rest } = basicInfo || {};
      const { employment, education, ...profileData } = profile || {};

      return await prisma.tutor.update({
        where: { userId: user.id },
        data: {
          applicationStatus,
          subjects:
            typeof subjects !== "undefined"
              ? {
                  set: [],
                  connect: subjects.map((id) => ({ id })),
                }
              : undefined,
          location:
            typeof location !== "undefined"
              ? {
                  create: location,
                }
              : undefined,

          education:
            typeof education !== "undefined"
              ? {
                  create: education,
                }
              : undefined,
          employment:
            typeof employment !== "undefined"
              ? {
                  create: employment as any,
                }
              : undefined,

          ...rest,
          ...profileData,
        },
      });
    }),

  addSubjectsToTutor: protectedProcedure
    .input(z.object({ subjects: z.string().cuid().array().min(1).max(5) }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { subjects } = input;

      return await prisma.tutor.update({
        where: { userId: session.user.id },
        data: {
          subjects: {
            set: [],
            connect: subjects.map((id) => ({ id })),
          },
        },
      });
    }),

  // Convert a regular Profile into a TutorProfile. @admin
  create: adminProtectedProcedure
    .input(z.object({ profileId: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      return { input, ctx };
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
