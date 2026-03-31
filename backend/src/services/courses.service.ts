import { prisma } from "../lib/prisma";

export const coursesService = {
    async create(data: any) {
        return prisma.course.create({
            data,
        });
    },

    async listAll() {
        return prisma.course.findMany({
            include: {
                ngo: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async listByNgo(ngoId: string) {
        return prisma.course.findMany({
            where: { ngoId },
            include: {
                ngo: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async getById(id: string) {
        return prisma.course.findUnique({
            where: { id },
        });
    },

    async update(id: string, data: any) {
        return prisma.course.update({
            where: { id },
            data,
        });
    },

    async delete(id: string) {
        return prisma.course.delete({
            where: { id },
        });
    },
};
