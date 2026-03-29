import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.seekerExperience.deleteMany();
  await prisma.seekerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding fake users and companies...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Seekers
  const seekers = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: "seeker",
        passwordHash,
        status: "active",
        profileCompletion: faker.number.int({ min: 50, max: 100 }),
        createdAt: faker.date.past({ years: 1 }),
        seekerProfile: {
          create: {
            headline: faker.person.jobTitle(),
            location: faker.location.city() + ", " + faker.location.country(),
            phone: faker.phone.number(),
            avatarUrl: faker.image.avatar(),
            skillsRaw: JSON.stringify(
              faker.helpers.arrayElements(
                [
                  "React",
                  "Node.js",
                  "TypeScript",
                  "Python",
                  "Java",
                  "Docker",
                  "AWS",
                ],
                { min: 2, max: 5 },
              ),
            ),
            profileStrength: faker.number.int({ min: 50, max: 100 }),
            experiences: {
              create: [
                {
                  title: faker.person.jobTitle(),
                  company: faker.company.name(),
                  period: `2020 - 2022`,
                },
                {
                  title: faker.person.jobTitle(),
                  company: faker.company.name(),
                  period: `2022 - Present`,
                },
              ],
            },
          },
        },
        settings: {
          create: {
            emailNotifications: true,
            marketingEmails: false,
            darkMode: false,
          },
        },
      },
    });
    seekers.push(user);
  }

  // 2. Create Companies
  const companies = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: "company",
        passwordHash,
        status: "active",
        companyProfile: {
          create: {
            name: faker.company.name(),
            logo: faker.image.urlLoremFlickr({ category: "logo" }),
            tagline: faker.company.catchPhrase(),
            about: faker.company.buzzPhrase(),
            industry: faker.helpers.arrayElement([
              "Technology",
              "Finance",
              "Healthcare",
              "Education",
            ]),
            size: faker.helpers.arrayElement([
              "1-10",
              "11-50",
              "51-200",
              "201-500",
              "500+",
            ]),
            founded: faker.number.int({ min: 1990, max: 2023 }),
            headquarters: faker.location.city(),
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            recruiterName: faker.person.fullName(),
            recruiterDesignation: "HR Manager",
            isHiring: true,
            openPositions: faker.number.int({ min: 1, max: 10 }),
            onboardingCompleted: true,
          },
        },
      },
      include: {
        companyProfile: true,
      },
    });
    companies.push(user);
  }

  // 3. Create Jobs
  const jobs = [];
  const jobTypes = ["full-time", "part-time", "contract"];
  for (const company of companies) {
    if (!company.companyProfile) continue;

    for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
      const job = await prisma.job.create({
        data: {
          title: faker.person.jobTitle(),
          companyId: company.companyProfile.companyId,
          location: faker.location.city(),
          salaryMin: faker.number.int({ min: 40000, max: 80000 }),
          salaryMax: faker.number.int({ min: 90000, max: 150000 }),
          type: faker.helpers.arrayElement(jobTypes),
          remote: faker.datatype.boolean(),
          skillsRaw: JSON.stringify(
            faker.helpers.arrayElements(
              [
                "React",
                "Node.js",
                "TypeScript",
                "Python",
                "Java",
                "Docker",
                "AWS",
              ],
              { min: 2, max: 5 },
            ),
          ),
          description: faker.lorem.paragraphs(2),
          responsibilitiesRaw: JSON.stringify([
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
          ]),
          applicantsCount: 0,
          postedAt: faker.date.recent({ days: 30 }),
          active: true,
        },
      });
      jobs.push(job);
    }
  }

  // 4. Create Applications
  const statuses = ["applied", "shortlisted", "interview", "hired", "rejected"];
  for (const seeker of seekers) {
    const appliedJobs = faker.helpers.arrayElements(jobs, { min: 1, max: 4 });
    for (const job of appliedJobs) {
      const companyProfile = await prisma.companyProfile.findUnique({
        where: { companyId: job.companyId },
      });

      if (!companyProfile) continue;

      await prisma.application.create({
        data: {
          seekerId: seeker.id,
          jobId: job.id,
          jobTitle: job.title,
          company: companyProfile.name,
          companyLogo: companyProfile.logo,
          status: faker.helpers.arrayElement(statuses),
          appliedAt: faker.date.recent({ days: 15 }),
          matchScore: faker.number.int({ min: 50, max: 100 }),
        },
      });

      // Increment applicantsCount
      await prisma.job.update({
        where: { id: job.id },
        data: { applicantsCount: { increment: 1 } },
      });
    }
  }

  // 5. Create an Admin User
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@jobseva.com",
      role: "admin",
      passwordHash,
      status: "active",
      createdAt: new Date(),
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
