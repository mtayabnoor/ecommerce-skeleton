import { prisma } from '@/lib/prisma';
import sampleData from './sample-data';

async function main() {
  console.log('Clearing database...');
  await prisma.product.deleteMany();

  console.log('Inserting sample data...');
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
