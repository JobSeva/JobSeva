import { PrismaClient } from '@prisma/client';
import { companyJobsService } from './src/services/company-jobs.service';

const prisma = new PrismaClient();

async function main() {
    const ownerUserId = '89457ec4-bad9-4c7a-b4cf-8ef86f192178';
    const jobId = '8a002c06-1753-4b79-9432-025e62accbd4';

    try {
        const applicants = await companyJobsService.listApplicants(ownerUserId, jobId);
        console.log('Applicants:', JSON.stringify(applicants, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
