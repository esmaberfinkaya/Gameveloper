const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clean up existing data to prevent duplicates on multiple runs
  await prisma.message.deleteMany({});
  await prisma.partnership.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Users
  const esma = await prisma.user.create({
    data: { email: 'esma@gameveloper.com', name: 'Esma', password: passwordHash, role: 'DEVELOPER', trustScore: 1500 }
  });
  const alphaGamer = await prisma.user.create({
    data: { email: 'alpha@gameveloper.com', name: 'AlphaGamer', password: passwordHash, role: 'GAMER', trustScore: 800 }
  });
  const codeSamurai = await prisma.user.create({
    data: { email: 'samurai@gameveloper.com', name: 'CodeSamurai', password: passwordHash, role: 'DEVELOPER', trustScore: 2100 }
  });
  const pixelHunter = await prisma.user.create({
    data: { email: 'pixel@gameveloper.com', name: 'PixelHunter', password: passwordHash, role: 'GAMER', trustScore: 450 }
  });

  const users = [esma, alphaGamer, codeSamurai, pixelHunter];

  // 2. Ideas (8 ideas)
  const ideas = [
    { title: 'Oyun Pazaryeri (Game Marketplace) Entegrasyon Modeli', content: 'Oyuncuların oyun içi eşyalarını güvenle alıp satabileceği, blockchain tabanlı veya merkezi bir pazar yeri tasarımı...', story: 'Bu fikir, oyun içi ekonomilerin tıkanıklığını çözmek amacıyla doğdu. Eşya ticaretindeki dolandırıcılık vakalarını engellemeyi hedefler.', visuals: 'UI taslakları ve veri akış diyagramları.', gameplay: 'Oyuncu envanterine doğrudan pazar yeri erişimi eklenecek.', category: 'Web3 / Economy', userId: esma.id },
    { title: 'TCP/UDP Tabanlı Cross-Platform Multiplayer Altyapısı', content: 'Farklı platformlardaki oyuncuların (PC, Konsol, Mobil) düşük ping ile birbiriyle oynayabileceği, hybrid TCP/UDP sunucu mimarisi...', story: 'Mobil ve PC oyuncuları arasındaki ağ eşitsizliğini en aza indirmek için.', visuals: 'Mimari diagramlar (C++ / Node.js)', gameplay: 'Pürüzsüz multiplayer deneyimi.', category: 'Networking', userId: codeSamurai.id },
    { title: 'Dinamik Görev Sistemi (Dynamic Quest Engine)', content: 'Oyuncunun seviyesine, önceki seçimlerine ve haritadaki konumuna göre anlık olarak procedurally generated görevler üreten sistem.', story: 'RPG oyunlarında aynı görevleri yapmaktan sıkılan oyuncular için sonsuz bir içerik döngüsü sağlamak.', visuals: 'Görev ağacı mockup', gameplay: 'Her oynanışta farklı görevler ve ödüller.', category: 'RPG Mechanics', userId: alphaGamer.id },
    { title: 'Siberpunk Şehir Üreticisi (Procedural City Gen)', content: 'Unity veya Unreal için, binaları, sokakları ve neon tabelaları rastgele ancak mantıklı bir düzende oluşturan araç.', story: 'Büyük açık dünyaları tasarlamak çok zaman alıyor, bunu otomatize etmeliyiz.', visuals: 'Şehir planı renderları.', gameplay: 'Yok (Tooling)', category: 'Tools', userId: pixelHunter.id },
    { title: 'Yapay Zeka Tabanlı NPC Diyalog Sistemi', content: 'NPC\'lerin sabit metinler yerine LLM (Büyük Dil Modeli) kullanarak oyuncuya bağlama uygun, dinamik cevaplar vermesini sağlayan eklenti.', story: 'Oyun dünyasının daha canlı ve gerçekçi hissettirmesi için.', visuals: 'Diyalog ekranı UI.', gameplay: 'Sonsuz farklı konuşma ihtimali.', category: 'AI', userId: esma.id },
    { title: 'Görsel Roman için Savaş Mekaniği Eklentisi', content: 'Klasik görsel romanlara entegre edilebilir, sıra tabanlı basit bir savaş motoru (Turn-based RPG Engine).', story: 'Hikaye odaklı oyunlara heyecan katmak.', visuals: 'Savaş arayüzü mockup', gameplay: 'Stratejik sıra tabanlı savaşlar.', category: '2D / VN', userId: codeSamurai.id },
    { title: 'VR İçin Gerçekçi Envanter Çantası', content: 'Oyuncunun sırtına astığı sanal bir çantayı eliyle karıştırarak fiziksel olarak eşya bulmasını sağlayan VR envanter mekaniği.', story: 'VR\'da menü kullanmak immersion\'ı bozuyor.', visuals: 'Çanta ve el etkileşim prototipleri.', gameplay: 'Fiziksel etkileşimli envanter yönetimi.', category: 'VR', userId: alphaGamer.id },
    { title: 'Ses Kontrollü Büyü Sistemi', content: 'Oyuncunun mikrofona büyü isimlerini (Örn: "Ignis!", "Glacius!") söyleyerek yetenek kullandığı bir sistem.', story: 'Daha sürükleyici ve aksiyon dolu bir deneyim için.', visuals: 'Mikrofon feedback UI.', gameplay: 'Ses tanıma ile aksiyon.', category: 'Mechanics', userId: pixelHunter.id },
  ];

  for (const idea of ideas) {
    await prisma.post.create({
      data: { ...idea, postType: 'IDEA' }
    });
  }

  // 3. Questions / Issues (8 issues)
  const issues = [
    { title: 'Flutter UI Performans Darboğazı', content: 'Mobil uygulamamızda yüzlerce item içeren ListView kaydırılırken inanılmaz frame dropları (jank) yaşıyoruz. Profiler\'dan baktığımda build metodunun gereksiz yere tetiklendiğini gördüm ama sorunu çözemiyorum. const constructor\'ları ekledim ancak hala devam ediyor. Aşağıda ilgili widget\'ın kodunu ve logları bırakıyorum, yardımlarınızı bekliyorum.', category: 'Mobile UI', userId: esma.id },
    { title: 'PostgreSQL\'de Eşzamanlı Okuma Hataları', content: 'Yüksek anlık trafiğe sahip projemizde Prisma ile PostgreSQL\'e bağlanıyoruz. Aynı anda 500+ kullanıcı girdiğinde "Too many connections" ve deadlock hataları fırlatılıyor. Connection pooling için PgBouncer denedim fakat Prisma ile tam senkronize çalıştıramadım. Mimari olarak neyi yanlış yapıyor olabiliriz? Lütfen sadece tecrübeli veritabanı uzmanları.', category: 'Database', userId: codeSamurai.id },
    { title: 'Unity WebGL Build Boyutu Çok Büyük', content: 'Oyunumuzu WebGL formatında build alıyoruz fakat sadece 2 sahne ve temel modeller olmasına rağmen dosya boyutu 150MB civarında çıkıyor. Sıkıştırma (Compression) ayarlarını Brotli yaptım, gereksiz assetleri çıkardım. Tarayıcıda yüklenmesi çok uzun sürüyor. Hangi ayarları gözden kaçırıyor olabilirim?', category: 'Unity / Build', userId: alphaGamer.id },
    { title: 'Unreal Engine 5 Lumen Işıklandırma Sorunu', content: 'UE5\'te kapalı bir mekan tasarımı (indoor environment) yapıyorum. Lumen kullanarak aydınlatma kurdum fakat karanlık alanlarda korkunç bir "ghosting" ve "noise" (karıncalanma) problemi var. Post-process ayarlarıyla oynamama rağmen sonuç tatmin edici değil. Hardware raytracing açık. Çözüm önerisi olan var mı?', category: 'Lighting / UE5', userId: pixelHunter.id },
    { title: 'Node.js Socket.io Bellek Sızıntısı (Memory Leak)', content: 'Canlı sohbet sunucumuz bir süre çalıştıktan sonra RAM tüketimi giderek artıyor ve Node.js sunucusu çöküyor. Heap dump aldığımda eski socket objelerinin garbage collector tarafından temizlenmediğini fark ettim. Kullanıcı düştüğünde socket.disconnect() çalışıyor ancak sanırım referanslar bir yerde kalıyor. Nasıl debug edebilirim?', category: 'Backend / Realtime', userId: esma.id },
    { title: 'C# Garbage Collection Tıklanma Gecikmesi', content: 'Oyun içi nesne havuzu (Object Pooling) kullanmama rağmen her 10 saniyede bir GC (Garbage Collection) devreye girip anlık takılmalara (spike) sebep oluyor. Profiler\'da "String.Concat" ve bazi LINQ sorgularının çok çöp ürettiğini gördüm. Bunları nasıl optimize edebiliriz? Tüm LINQ kullanımlarını kaldırmak mı gerekir?', category: 'C# / Optimization', userId: codeSamurai.id },
    { title: 'Steamworks Entegrasyonu Başarısız Oluyor', content: 'Oyunumu Steam\'e yüklemek için Steamworks.NET eklentisini kurdum. AppID\'mi "steam_appid.txt" içine yazdım ancak SteamAPI.Init() fonksiyonu sürekli false dönüyor. Steam istemcisi arkada açık, farklı bilgisayarlarda denedim yine aynı. Bu hatanın arkasında yatan sebep ne olabilir?', category: 'Publishing', userId: alphaGamer.id },
    { title: '2D Platformer Zıplama Fiziği Çok Kaygan', content: 'Karakterin zıplama ve yürüme fizikleri (Rigidbody2D velocity üzerinden) yapıyorum ancak Super Mario veya Celeste gibi keskin ve tatmin edici (snappy) hissettirmiyor. Havada kontrol (Air Control) yaparken sanki buz üstünde kayıyormuş gibi bir his var. Raycast mi kullanmalıyım yoksa yerleşik fizik motorunu mu kapatmalıyım?', category: 'Physics', userId: pixelHunter.id },
  ];

  for (const issue of issues) {
    await prisma.post.create({
      data: { ...issue, postType: 'QUESTION' }
    });
  }

  // 4. Partnerships (4 listings)
  const partnerships = [
    { title: 'Oyun Pazaryeri İçin Backend Dev Aranıyor', description: 'Geliştirmekte olduğumuz Game Marketplace projesi için Node.js ve veritabanı (PostgreSQL) mimarilerine hakim, güvenlik odaklı bir Backend Developer arıyoruz. Önceliğimiz mikroservis tecrübesi olanlar.', requiredRole: 'BACKEND DEV', isUrgent: true, userId: esma.id },
    { title: 'Siberpunk Arayüz İçin UI/UX Partneri', description: 'Yeni projemizin tüm UI/UX süreçlerini yönetecek, neon renk paletlerine ve siberpunk tasarım diline hakim bir tasarımcı takım arkadaşı arıyoruz. Figma üzerinde çalışılacak.', requiredRole: 'UI/UX DESIGNER', isUrgent: false, userId: codeSamurai.id },
    { title: 'Unreal Engine 5 Environment Artist', description: 'Karanlık ve gotik bir açık dünya oyunumuz için çevresel hikaye anlatımına (environmental storytelling) önem veren 3D modelleme ve level design uzmanı.', requiredRole: '3D ARTIST', isUrgent: true, userId: pixelHunter.id },
    { title: 'Retro Oyun Müzikleri İçin Kompozitör', description: '16-bit tarzı nostaljik ve akılda kalıcı chiptune müzikler üretebilecek tutkulu bir müzisyen. Oyunumuz bir aksiyon-platformer ve hareketli parçalara ihtiyacımız var.', requiredRole: 'SOUND DESIGNER', isUrgent: false, userId: alphaGamer.id },
  ];

  for (const part of partnerships) {
    await prisma.partnership.create({ data: part });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
