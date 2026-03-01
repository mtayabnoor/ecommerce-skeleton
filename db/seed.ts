import { prisma } from '@/lib/prisma';
import sampleData from './sample-data';

async function main() {
  console.log('Clearing database...');
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('Inserting sample data...');
  await prisma.user.createMany({
    data: sampleData.users,
  });
  await prisma.product.createMany({
    data: sampleData.products, // sampleData should be an array of Product objects
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
