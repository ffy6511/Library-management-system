import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('admin123', 10);
  
  const admin = await prisma.admin.create({
    data: {
      id: 'admin',
      password: hashedPassword,
      name: '系统管理员',
      contact: 'admin@library.com'
    }
  });

  console.log('Created admin:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });