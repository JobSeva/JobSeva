import { prisma } from "../lib/prisma";

export const enrollmentsService = {
    async enroll(userId: string, courseId: string) {
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existing) {
            return { duplicate: true };
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
            },
        });

        return { enrollment };
    },

    async getUserEnrollments(userId: string) {
        return prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: true,
            },
            orderBy: { enrolledAt: "desc" },
        });
    },

    async getCourseEnrollments(courseId: string) {
        return prisma.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { enrolledAt: "desc" },
        });
    },
};
