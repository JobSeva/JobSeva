import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { SeekerExperience, SeekerProfile } from "../types/domain";

const nowIso = () => new Date().toISOString();

const recomputeStrength = (profile: SeekerProfile): number => {
  let strength = 35;
  if (profile.headline.trim().length >= 6) strength += 15;
  if (profile.location.trim().length >= 2) strength += 10;
  if (profile.phone.trim().length >= 8) strength += 10;
  if (profile.skills.length >= 3) strength += 15;
  if (profile.experiences.length >= 1) strength += 10;
  if (profile.resumeUrl) strength += 5;

  return Math.min(100, strength);
};

const mapDbToSeekerProfile = (
  dbProfile: any,
): SeekerProfile => {
  return {
    userId: dbProfile.userId,
    headline: dbProfile.headline || "",
    location: dbProfile.location || "",
    phone: dbProfile.phone || "",
    avatarUrl: dbProfile.avatarUrl || undefined,
    skills: JSON.parse(dbProfile.skillsRaw || "[]"),
    experiences: dbProfile.experiences.map((exp: any) => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      period: exp.period,
    })),
    resumeUrl: dbProfile.resumeUrl || undefined,
    profileStrength: dbProfile.profileStrength,
    updatedAt: dbProfile.updatedAt.toISOString(),
  };
};

const getOrCreateProfile = async (userId: string): Promise<SeekerProfile> => {
  // Check if user exists and is a seeker
  const user = await prisma.user.findFirst({
    where: { id: userId, role: "seeker" },
  });

  if (!user) {
    throw new AppError(404, "Seeker not found", "SEEKER_NOT_FOUND");
  }

  // Find or create seeker profile
  let seekerProfile = await prisma.seekerProfile.findUnique({
    where: { userId },
    include: { experiences: true },
  });

  if (!seekerProfile) {
    seekerProfile = await prisma.seekerProfile.create({
      data: {
        userId,
        headline: "",
        location: "",
        phone: "",
        skillsRaw: JSON.stringify([]),
        profileStrength: 35,
      },
      include: { experiences: true },
    });
  }

  return mapDbToSeekerProfile(seekerProfile);
};

const touch = async (
  userId: string,
  profile: SeekerProfile,
): Promise<SeekerProfile> => {
  profile.profileStrength = recomputeStrength(profile);

  const updated = await prisma.seekerProfile.update({
    where: { userId },
    data: {
      profileStrength: profile.profileStrength,
    },
    include: { experiences: true },
  });

  return mapDbToSeekerProfile(updated);
};

export const seekerProfileService = {
  async get(userId: string): Promise<SeekerProfile> {
    return getOrCreateProfile(userId);
  },

  async update(
    userId: string,
    patch: Partial<
      Pick<SeekerProfile, "headline" | "location" | "phone" | "skills">
    >,
  ): Promise<SeekerProfile> {
    const profile = await getOrCreateProfile(userId);

    if (typeof patch.headline === "string") {
      profile.headline = patch.headline;
    }

    if (typeof patch.location === "string") {
      profile.location = patch.location;
    }

    if (typeof patch.phone === "string") {
      profile.phone = patch.phone;
    }

    if (Array.isArray(patch.skills)) {
      profile.skills = patch.skills;
    }

    // Update in database
    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: {
        headline: profile.headline,
        location: profile.location,
        phone: profile.phone,
        skillsRaw: JSON.stringify(profile.skills),
      },
      include: { experiences: true },
    });

    return touch(userId, mapDbToSeekerProfile(updated));
  },

  async uploadAvatar(userId: string, avatarUrl: string): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: { avatarUrl },
      include: { experiences: true },
    });

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async uploadResume(
    userId: string,
    resumeUrl: string,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: { resumeUrl },
      include: { experiences: true },
    });

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async deleteResume(userId: string): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: { resumeUrl: null },
      include: { experiences: true },
    });

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async addExperience(
    userId: string,
    payload: Omit<SeekerExperience, "id">,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    await prisma.seekerExperience.create({
      data: {
        seekerProfileId: userId,
        title: payload.title,
        company: payload.company,
        period: payload.period,
      },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async updateExperience(
    userId: string,
    experienceId: string,
    payload: Omit<SeekerExperience, "id">,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const experience = await prisma.seekerExperience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      throw new AppError(404, "Experience not found", "EXPERIENCE_NOT_FOUND");
    }

    await prisma.seekerExperience.update({
      where: { id: experienceId },
      data: {
        title: payload.title,
        company: payload.company,
        period: payload.period,
      },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async deleteExperience(
    userId: string,
    experienceId: string,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const experience = await prisma.seekerExperience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      throw new AppError(404, "Experience not found", "EXPERIENCE_NOT_FOUND");
    }

    await prisma.seekerExperience.delete({
      where: { id: experienceId },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },
};
