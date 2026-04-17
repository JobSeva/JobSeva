import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const apps = await prisma.application.findMany({
        include: {
            job: true,
            seeker: true
        }
    });
    console.log(`Total Applications: ${apps.length}`);
    apps.forEach(app => {
        console.log(`- App ID: ${app.id}, Seeker: ${app.seeker.name}, Job: ${app.job.title}, Status: ${app.status}, Company: ${app.job.companyId}`);
    });

    const companies = await prisma.companyProfile.findMany();
    console.log(`\nCompanies:`);
    companies.forEach(c => {
        console.log(`- Company ID: ${c.companyId}, Name: ${c.name}, Owner: ${c.ownerUserId}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
