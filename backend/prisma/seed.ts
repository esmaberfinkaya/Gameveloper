import { PrismaClient, Role, PostType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed initialization started...');

  // 1. Clean existing data in correct dependency order
  await prisma.comment.deleteMany();
  await prisma.partnership.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('Existing data cleared.');

  // 2. Hash password for test accounts
  const passwordHash = await bcrypt.hash('123456', 10);

  // 3. Create users (personas)
  const esma = await prisma.user.create({
    data: {
      email: 'esma@gameveloper.com',
      name: 'Esma',
      password: passwordHash,
      role: Role.DEVELOPER,
      trustScore: 0,
    },
  });

  const cyberDev = await prisma.user.create({
    data: {
      email: 'cyberdev@gameveloper.com',
      name: 'CyberDev',
      password: passwordHash,
      role: Role.DEVELOPER,
      trustScore: 0,
    },
  });

  const blenderMaster = await prisma.user.create({
    data: {
      email: 'blendermaster@gameveloper.com',
      name: 'BlenderMaster',
      password: passwordHash,
      role: Role.DEVELOPER,
      trustScore: 0,
    },
  });

  const alphaGamer = await prisma.user.create({
    data: {
      email: 'alphagamer@gameveloper.com',
      name: 'AlphaGamer',
      password: passwordHash,
      role: Role.GAMER,
      trustScore: 0,
    },
  });

  console.log('Test personas created successfully.');

  // 4. Create Posts
  // Esma's showcase post
  const esmaPost = await prisma.post.create({
    data: {
      title: 'Cyber Neon - Fast Paced Shooter',
      content: 'Merhaba arkadaşlar, 6 aydır üzerinde çalıştığım neon temalı cyberpunk FPS oyunumun ilk oynanış videosu ve Steam sayfası yayında. Hızlı hareket mekanikleri ve duvar koşusu ekledim. Unity HDRP kullanarak optimize ettim. Geri bildirimlerinizi bekliyorum!',
      story: 'Cyberpunk evreninde geçen hızlı ritimli bir FPS oyunu.',
      visuals: 'Neon ışıklı sokaklar ve yansımalar.',
      gameplay: 'Duvar koşusu ve dash mekanikleri.',
      category: 'Showcase',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      postType: PostType.PROJECT,
      userId: esma.id,
    },
  });

  // CyberDev's resolved question post
  const cyberDevPost = await prisma.post.create({
    data: {
      title: 'NullReferenceException at PlayerMovement.cs',
      content: 'Karakter zıplama kodunu yazarken Rigidbody bileseni null dönüyor. GetComponent() metodunu Awake icinde cagirdim ama ise yaramadi.',
      category: 'Unity',
      postType: PostType.QUESTION,
      isResolved: true,
      userId: cyberDev.id,
    },
  });

  // AlphaGamer's design idea post
  const alphaGamerPost = await prisma.post.create({
    data: {
      title: 'Zamanı Donduran Kılıç Ustası',
      content: 'Ana karakter zamanı yavaşlatabiliyor ancak hareket ettikçe kendi canı azalıyor.',
      story: 'Ana karakter zamanı yavaşlatabiliyor ancak hareket ettikçe kendi canı azalıyor.',
      visuals: 'Karanlık ve neon ışıklı bir metropolis, low poly karakter tasarımı.',
      gameplay: 'Hack and slash mekanikleri ve ritim tabanlı combo sistemi.',
      category: 'Aksiyon',
      postType: PostType.IDEA,
      userId: alphaGamer.id,
    },
  });

  // BlenderMaster's art post
  const blenderMasterPost = await prisma.post.create({
    data: {
      title: 'Sci-Fi Koridor Render',
      content: 'Blender Eevee kullanarak hazırladığım yeni çevre tasarımı. Işıklandırma konusunda fikirlerinizi merak ediyorum.',
      category: 'Art',
      imageUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2070&auto=format&fit=crop',
      postType: PostType.PROJECT,
      userId: blenderMaster.id,
    },
  });

  console.log('Posts seeded successfully.');

  // 5. Create Comments / Responses
  // Esma's accepted solution to CyberDev's question
  await prisma.comment.create({
    data: {
      content: 'GetComponent<Rigidbody>() çağrısını Awake yerine Start fonksiyonu içinde yapmayı deneyin. Ayrıca Player GameObject\'inde Rigidbody component\'inin ekli olduğundan emin olun.',
      type: 'SOLUTION',
      isAccepted: true,
      userId: esma.id,
      postId: cyberDevPost.id,
    },
  });

  // AlphaGamer's casual comment to CyberDev's question
  await prisma.comment.create({
    data: {
      content: 'Aynı hatayı ben de almıştım, bu çözüm işe yarıyor!',
      type: 'COMMENT',
      isAccepted: false,
      userId: alphaGamer.id,
      postId: cyberDevPost.id,
    },
  });

  // CyberDev's private mentor comment on AlphaGamer's idea
  await prisma.comment.create({
    data: {
      content: 'Fikir harika! Zamanı yavaşlatma mekaniği için C# tarafında Time.timeScale kullanabilirsin. Can azaltma formülünü deltaTime bazlı kurmak iyi olacaktır.',
      type: 'COMMENT',
      isPrivate: true,
      userId: cyberDev.id,
      postId: alphaGamerPost.id,
    },
  });

  console.log('Comments and solutions seeded successfully.');

  // 6. Create Partnerships (including URGENT ones)
  // BlenderMaster's URGENT partnership
  await prisma.partnership.create({
    data: {
      title: 'Sci-Fi Çevre Tasarımı İçin Yardım',
      description: 'Unity HDRP kullanarak geliştirdiğim projede sci-fi koridor ve dış mekan modellemeleri yapacak bir 3D artist arıyorum.',
      requiredRole: '3D ARTIST',
      isUrgent: true,
      userId: blenderMaster.id,
    },
  });

  // CyberDev's URGENT partnership
  await prisma.partnership.create({
    data: {
      title: 'Multiplayer Kart Oyunu İçin Backend Developer',
      description: 'Node.js ve Socket.io kullanarak gerçek zamanlı bir multiplayer kart oyunu geliştiriyoruz. Backend tarafında deneyimli bir yazılımcıya ihtiyacımız var.',
      requiredRole: 'BACKEND DEV',
      isUrgent: true,
      userId: cyberDev.id,
    },
  });

  // AlphaGamer's standard partnership
  await prisma.partnership.create({
    data: {
      title: 'Pixel Art Metroidvania - Müzisyen / Ses Tasarımcısı',
      description: '2D pixel art tarzındaki metroidvania oyunumuz için karanlık ve atmosferik müzikler yapabilecek bir ekip arkadaşı arıyoruz.',
      requiredRole: 'SOUND DESIGNER',
      isUrgent: false,
      userId: alphaGamer.id,
    },
  });

  console.log('Partnerships seeded successfully.');
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
