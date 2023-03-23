import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProtectedProcedure,
} from "@/server/api/trpc";
import { TutorStatus } from "@prisma/client";

const BasicInfoSchema = z.object({
  age: z.number().int().min(18).max(99).default(18),
  phone: z.string().describe("tel").min(10),
  address: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1), // enum ?
  zip: z.string().min(5),
  country: z.string().min(1),
});

const AuthorizationSchema = z.object({
  isWorkAuthorized: z.boolean().describe("checkbox"),
  needsVisaSponsorship: z.boolean().describe("checkbox"),
  hasVisaDependency: z.boolean().describe("checkbox"),
});

const TechnicalSchema = z.object({
  hasInternetConnection: z.boolean().describe("checkbox"),
  hasTechnicalKnowledge: z.boolean().describe("checkbox"),
  hasMicrophone: z.boolean().describe("checkbox"),
  hasWebcam: z.boolean().describe("checkbox"),
});

const EducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string(),
  fieldOfStudy: z.string(),
  educationYearStarted: z.string().min(4).max(4),
  educationYearEnded: z.string().optional(),
  educationMonthStarted: z.string(),
  educationMonthEnded: z.string().optional(),
});

const EmploymentSchema = z.object({
  employmentTitle: z.string().nonempty(),
  employmentType: z.string(),
  companyName: z.string().min(1),
  employmentMonthStarted: z.string(),
  employmentYearStarted: z.string(),
  employmentMonthEnded: z.string(),
  employmentYearEnded: z.string(),
});

const schema = z
  .object({})
  .merge(AuthorizationSchema)
  .merge(BasicInfoSchema)
  .merge(TechnicalSchema)
  .merge(EducationSchema)
  .merge(EmploymentSchema);

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

      return await prisma.profile.findUnique({
        where: { id },
        include: { tutorProfile: true },
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
      return { input, ctx };
    }),

  submitApplication: protectedProcedure
    .input(z.object({ data: schema, id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { prisma, session } = ctx;
        const { data, id } = input;

        // session id has to match the profile id
        const profile = await prisma.profile.findUnique({
          where: { id },
          include: { tutorProfile: true },
        });
        if (!profile || profile.userId !== session.user.id)
          throw new Error("Not validated");

        if (profile.tutorProfile !== null) throw new Error("Already exists");

        // parse out location, education and experience properties
        const {
          school,
          degree,
          fieldOfStudy,
          educationYearEnded,
          educationYearStarted,
          educationMonthEnded,
          educationMonthStarted,
          employmentTitle,
          employmentType,
          employmentYearEnded,
          employmentMonthEnded,
          employmentYearStarted,
          employmentMonthStarted,
          address,
          address2,
          city,
          companyName,
          state,
          zip,
          country,
          ...rest
        } = data;

        await prisma.profile.update({
          where: { id },
          data: {
            tutorProfile: {
              create: {
                status: "PENDING",
                location: {
                  create: {
                    zip,
                    city,
                    state,
                    address,
                    address2,
                    country,
                  },
                },
                education: {
                  create: {
                    degree,
                    school,
                    fieldOfStudy,
                    yearStarted: educationYearStarted,
                    yearEnded: educationYearEnded || "",
                    monthStarted: educationMonthStarted,
                    monthEnded: educationMonthEnded || "",
                  },
                },
                employment: {
                  create: {
                    companyName,
                    monthEnded: employmentMonthEnded,
                    monthStarted: employmentMonthStarted,
                    yearEnded: employmentYearEnded,
                    yearStarted: employmentYearStarted,
                    type: employmentType,
                    title: employmentTitle,
                  },
                },
                ...rest,
              },
            },
          },
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
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
