import { prisma } from "../lib/prisma";
import { User, Job, CompanyProfile } from "../types/domain";

type AdminUserExportRow = {
  Email: string;
  Name: string;
  Address: string;
  "Phone no.": string;
  "Resume link": string;
};

type AdminOrgExportRow = {
  Name: string;
  Email: string;
  "Phone no.": string;
};

export class AdminService {
  private getRangeMonths(range: string): number {
    if (range === "3m") return 3;
    if (range === "12m") return 12;
    return 6;
  }

  private getMonthBoundaries(months: number) {
    const now = new Date();
    const points: Array<{ start: Date; end: Date; label: string }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      points.push({
        start,
        end,
        label: start.toLocaleString("default", { month: "short" }),
      });
    }

    return points;
  }

  async getDashboardStats() {
    const activeJobs = await prisma.job.count({
      where: { active: true },
    });

    const totalJobs = await prisma.job.count();

    const totalUsers = await prisma.user.count();

    const totalApplications = await prisma.application.count();

    const placements = await prisma.application.count({
      where: { status: "hired" },
    });

    const companiesCount = await prisma.companyProfile.count();

    // Calculate actual pie data for user statuses
    const activeUsers = await prisma.user.count({
      where: { status: "active" },
    });
    const unverifiedUsers = await prisma.user.count({
      where: { isVerified: false },
    });
    const suspendedUsers = await prisma.user.count({
      where: { status: "suspended" },
    });

    const pieData = [
      { name: "Active", value: activeUsers },
      { name: "Unverified", value: unverifiedUsers },
      { name: "Suspended", value: suspendedUsers },
    ];

    // Calculate user growth for the past 6 months
    const userGrowth = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: d,
            lt: nextMonth,
          },
        },
      });
      userGrowth.push({
        month: d.toLocaleString("default", { month: "short" }),
        users: count,
      });
    }

    return {
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      placements,
      companiesCount,
      pieData,
      userGrowth,
    };
  }

  async listUsers(): Promise<Omit<User, "passwordHash">[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profileCompletion: true,
        createdAt: true,
        updatedAt: true,
        settings: true,
      },
    });

    return users as any;
  }

  async updateUserStatus(
    userId: string,
    status: "active" | "suspended",
  ): Promise<Omit<User, "passwordHash">> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profileCompletion: true,
        createdAt: true,
        updatedAt: true,
        settings: true,
      },
    });

    return user as any;
  }

  async listCompanies(): Promise<CompanyProfile[]> {
    const companies = await prisma.companyProfile.findMany();
    return companies as any;
  }

  async listNgos() {
    return prisma.ngoProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async exportJobSeekerUsersCsvData(): Promise<AdminUserExportRow[]> {
    const users = await prisma.user.findMany({
      where: {
        role: "seeker",
      },
      select: {
        email: true,
        name: true,
        seekerProfile: {
          select: {
            location: true,
            phone: true,
            resumeUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => ({
      Email: user.email,
      Name: user.name,
      Address: user.seekerProfile?.location ?? "",
      "Phone no.": user.seekerProfile?.phone ?? "",
      "Resume link": user.seekerProfile?.resumeUrl ?? "",
    }));
  }

  async exportCompaniesCsvData(): Promise<AdminOrgExportRow[]> {
    const companies = await prisma.companyProfile.findMany({
      select: {
        name: true,
        email: true,
        phone: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return companies.map((company) => ({
      Name: company.name,
      Email: company.email,
      "Phone no.": company.phone,
    }));
  }

  async exportNgosCsvData(): Promise<AdminOrgExportRow[]> {
    const ngos = await prisma.ngoProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return ngos.map((ngo) => ({
      Name: ngo.user?.name ?? "",
      Email: ngo.email || ngo.user?.email || "",
      "Phone no.": ngo.phone,
    }));
  }

  async getCompany(companyId: string): Promise<CompanyProfile> {
    const company = await prisma.companyProfile.findUnique({
      where: { companyId },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company as any;
  }

  async deleteCompany(companyId: string) {
    await prisma.companyProfile.delete({
      where: { companyId },
    });
    return { success: true };
  }

  async listJobs(): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      include: { company: true },
    });

    return jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "",
      companyId: job.companyId,
      companyLogo: job.company?.logo || "",
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      type: job.type as "full-time" | "part-time" | "contract",
      remote: job.remote,
      skills: JSON.parse(job.skillsRaw),
      description: job.description,
      responsibilities: JSON.parse(job.responsibilitiesRaw),
      applicants: job.applicantsCount,
      postedAt: job.postedAt.toISOString(),
      active: job.active,
      education: job.education || undefined,
      experience: job.experience || undefined,
      workMode: job.workMode || undefined,
      openings: job.openings,
      deadline: job.deadline?.toISOString() || undefined,
    }));
  }

  async moderateJob(jobId: string, active: boolean): Promise<Job> {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { active },
      include: { company: true },
    });

    return {
      id: job.id,
      title: job.title,
      company: job.company?.name || "",
      companyId: job.companyId,
      companyLogo: job.company?.logo || "",
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      type: job.type as "full-time" | "part-time" | "contract",
      remote: job.remote,
      skills: JSON.parse(job.skillsRaw),
      description: job.description,
      responsibilities: JSON.parse(job.responsibilitiesRaw),
      applicants: job.applicantsCount,
      postedAt: job.postedAt.toISOString(),
      active: job.active,
      education: job.education || undefined,
      experience: job.experience || undefined,
      workMode: job.workMode || undefined,
      openings: job.openings,
      deadline: job.deadline?.toISOString() || undefined,
    };
  }

  async deleteJob(jobId: string) {
    await prisma.job.delete({
      where: { id: jobId },
    });
    return { success: true };
  }

  async listAllApplications() {
    return await prisma.application.findMany({
      include: {
        seeker: true,
        job: { include: { company: true } },
      },
    });
  }

  async getUsers(page?: number, limit?: number) {
    if (!page || !limit) {
      return this.listUsers();
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profileCompletion: true,
        createdAt: true,
        updatedAt: true,
        settings: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.user.count();

    return {
      items: users as any,
      total,
      page,
      limit,
    };
  }

  async getJobs(page?: number, limit?: number) {
    if (!page || !limit) {
      return this.listJobs();
    }

    const jobs = await prisma.job.findMany({
      include: { company: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.job.count();

    const items = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "",
      companyId: job.companyId,
      companyLogo: job.company?.logo || "",
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      type: job.type as "full-time" | "part-time" | "contract",
      remote: job.remote,
      skills: JSON.parse(job.skillsRaw),
      description: job.description,
      responsibilities: JSON.parse(job.responsibilitiesRaw),
      applicants: job.applicantsCount,
      postedAt: job.postedAt.toISOString(),
      active: job.active,
      education: job.education || undefined,
      experience: job.experience || undefined,
      workMode: job.workMode || undefined,
      openings: job.openings,
      deadline: job.deadline?.toISOString() || undefined,
    }));

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async getApplications(page?: number, limit?: number) {
    if (!page || !limit) {
      return this.listAllApplications();
    }

    const applications = await prisma.application.findMany({
      include: {
        seeker: true,
        job: { include: { company: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.application.count();

    return {
      items: applications,
      total,
      page,
      limit,
    };
  }

  async getSystemLogs() {
    return [];
  }

  async getReportsAnalytics(range: string) {
    const months = this.getRangeMonths(range);
    const bounds = this.getMonthBoundaries(months);

    const monthlyData: Array<{
      month: string;
      users: number;
      jobs: number;
      placements: number;
    }> = [];

    const placementsData: Array<{ month: string; placements: number }> = [];

    for (const b of bounds) {
      const [users, jobs, placements] = await Promise.all([
        prisma.user.count({
          where: {
            createdAt: {
              gte: b.start,
              lt: b.end,
            },
          },
        }),
        prisma.job.count({
          where: {
            postedAt: {
              gte: b.start,
              lt: b.end,
            },
          },
        }),
        prisma.application.count({
          where: {
            status: "hired",
            updatedAt: {
              gte: b.start,
              lt: b.end,
            },
          },
        }),
      ]);

      monthlyData.push({
        month: b.label,
        users,
        jobs,
        placements,
      });

      placementsData.push({
        month: b.label,
        placements,
      });
    }

    const latest = monthlyData[monthlyData.length - 1] ?? {
      users: 0,
      jobs: 0,
      placements: 0,
    };

    const activeCompanies = await prisma.companyProfile.count({
      where: { isHiring: true },
    });

    const [fullTimeCount, partTimeCount, contractCount] = await Promise.all([
      prisma.job.count({ where: { type: "full-time" } }),
      prisma.job.count({ where: { type: "part-time" } }),
      prisma.job.count({ where: { type: "contract" } }),
    ]);

    const categoryData = [
      { name: "Full-time", value: fullTimeCount },
      { name: "Part-time", value: partTimeCount },
      { name: "Contract", value: contractCount },
    ].filter((item) => item.value > 0);

    return {
      range: `${months}m`,
      kpis: {
        monthlyUsers: latest.users,
        newJobs: latest.jobs,
        placements: latest.placements,
        activeCompanies,
      },
      monthlyData,
      categoryData,
      placementsData,
    };
  }
}

export const adminService = new AdminService();
