import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const usersCount = await prisma.user.count();
    const coursesCount = await prisma.course.count();
    console.log(`Users in DB: ${usersCount}`);
    console.log(`Courses in DB: ${coursesCount}`);
    const users = await prisma.user.findMany({ select: { email: true, isVerified: true } });
    console.log('Users:', users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
