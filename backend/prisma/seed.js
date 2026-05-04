const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seed initialization started...');

  const passwordHash = await bcrypt.hash('123456', 10);

  const gamer = await prisma.user.upsert({
    where: { email: 'gamer@gameveloper.com' },
    update: {},
    create: {
      email: 'gamer@gameveloper.com',
      name: 'TestGamer',
      password: passwordHash,
      role: 'GAMER',
      trustScore: 10,
    },
  });

  const developer = await prisma.user.upsert({
    where: { email: 'dev@gameveloper.com' },
    update: {},
    create: {
      email: 'dev@gameveloper.com',
      name: 'CyberDev',
      password: passwordHash,
      role: 'DEVELOPER',
      trustScore: 50,
    },
  });

  console.log('Created Users:', { gamer: gamer.email, developer: developer.email });
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
