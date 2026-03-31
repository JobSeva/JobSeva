import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { NgoProfile } from "../types/domain";

const recomputeStrength = (profile: NgoProfile): number => {
    let strength = 35;
    if (profile.description.trim().length >= 20) strength += 20;
    if (profile.location.trim().length >= 2) strength += 15;
    if (profile.phone.trim().length >= 8) strength += 15;
    if (profile.website.trim().length >= 5) strength += 10;
    if (profile.logoUrl) strength += 5;

    return Math.min(100, strength);
};

const mapDbToNgoProfile = (dbProfile: any): NgoProfile => {
    return {
        userId: dbProfile.userId,
        description: dbProfile.description || "",
        location: dbProfile.location || "",
        phone: dbProfile.phone || "",
        website: dbProfile.website || "",
        logoUrl: dbProfile.logoUrl || undefined,
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
                location: "",
                phone: "",
                website: "",
                profileStrength: 35,
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
        patch: Partial<Pick<NgoProfile, "description" | "location" | "phone" | "website">>,
    ): Promise<NgoProfile> {
        const profile = await getOrCreateProfile(userId);

        const updated = await prisma.ngoProfile.update({
            where: { userId },
            data: {
                description: patch.description ?? profile.description,
                location: patch.location ?? profile.location,
                phone: patch.phone ?? profile.phone,
                website: patch.website ?? profile.website,
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
