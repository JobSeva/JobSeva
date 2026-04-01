import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { NgoProfile } from "../types/domain";

const recomputeStrength = (profile: NgoProfile): number => {
    let strength = 20; // Base
    if (profile.description.trim().length >= 20) strength += 15;
    if (profile.tagline?.trim().length >= 5) strength += 10;
    if (profile.location.trim().length >= 2) strength += 10;
    if (profile.phone.trim().length >= 8) strength += 10;
    if (profile.email.trim().length >= 5) strength += 10;
    if (profile.website.trim().length >= 5) strength += 5;
    if (profile.logoUrl) strength += 5;
    if (profile.foundingYear > 1900) strength += 5;
    if (profile.size.trim().length > 0) strength += 5;
    if (profile.linkedin?.trim() && profile.linkedin.trim().length > 5) strength += 2;
    if (profile.twitter?.trim() && profile.twitter.trim().length > 5) strength += 1;
    if (profile.instagram?.trim() && profile.instagram.trim().length > 5) strength += 2;

    return Math.min(100, strength);
};

const mapDbToNgoProfile = (dbProfile: any): NgoProfile => {
    return {
        userId: dbProfile.userId,
        description: dbProfile.description || "",
        tagline: dbProfile.tagline || "",
        location: dbProfile.location || "",
        phone: dbProfile.phone || "",
        email: dbProfile.email || "",
        website: dbProfile.website || "",
        logoUrl: dbProfile.logoUrl || undefined,
        foundingYear: dbProfile.foundingYear || 0,
        size: dbProfile.size || "",
        linkedin: dbProfile.linkedin || undefined,
        twitter: dbProfile.twitter || undefined,
        instagram: dbProfile.instagram || undefined,
        profileStrength: dbProfile.profileStrength,
        updatedAt: dbProfile.updatedAt.toISOString(),
    };
};

const getOrCreateProfile = async (userId: string): Promise<NgoProfile> => {
    const user = await prisma.user.findFirst({
        where: { id: userId, role: "ngo" },
    });

    if (!user) {
        throw new AppError(404, "NGO not found", "NGO_NOT_FOUND");
    }

    let ngoProfile = await prisma.ngoProfile.findUnique({
        where: { userId },
    });

    if (!ngoProfile) {
        ngoProfile = await prisma.ngoProfile.create({
            data: {
                userId,
                description: "",
                tagline: "",
                location: "",
                phone: "",
                email: "",
                website: "",
                foundingYear: 0,
                size: "",
                profileStrength: 20,
            },
        });
    }

    return mapDbToNgoProfile(ngoProfile);
};

const touch = async (
    userId: string,
    profile: NgoProfile,
): Promise<NgoProfile> => {
    profile.profileStrength = recomputeStrength(profile);

    const updated = await prisma.ngoProfile.update({
        where: { userId },
        data: {
            profileStrength: profile.profileStrength,
        },
    });

    return mapDbToNgoProfile(updated);
};

export const ngoProfileService = {
    async get(userId: string): Promise<NgoProfile> {
        return getOrCreateProfile(userId);
    },

    async update(
        userId: string,
        patch: Partial<NgoProfile & { name?: string }>,
    ): Promise<NgoProfile> {
        const profile = await getOrCreateProfile(userId);

        // If name is provided, update the User model
        if (patch.name) {
            await prisma.user.update({
                where: { id: userId },
                data: { name: patch.name },
            });
        }

        const updated = await prisma.ngoProfile.update({
            where: { userId },
            data: {
                description: patch.description ?? profile.description,
                tagline: patch.tagline ?? profile.tagline,
                location: patch.location ?? profile.location,
                phone: patch.phone ?? profile.phone,
                email: patch.email ?? profile.email,
                website: patch.website ?? profile.website,
                foundingYear: patch.foundingYear ?? profile.foundingYear,
                size: patch.size ?? profile.size,
                linkedin: patch.linkedin ?? profile.linkedin,
                twitter: patch.twitter ?? profile.twitter,
                instagram: patch.instagram ?? profile.instagram,
                logoUrl: patch.logoUrl ?? profile.logoUrl,
            },
        });

        return touch(userId, mapDbToNgoProfile(updated));
    },

    async uploadLogo(userId: string, logoUrl: string): Promise<NgoProfile> {
        await getOrCreateProfile(userId);

        const updated = await prisma.ngoProfile.update({
            where: { userId },
            data: { logoUrl },
        });

        return touch(userId, mapDbToNgoProfile(updated));
    },
};
