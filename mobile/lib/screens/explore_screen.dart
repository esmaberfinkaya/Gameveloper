import 'package:flutter/material.dart';
import '../widgets/feed_card.dart';
import '../theme/app_theme.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  final List<Map<String, dynamic>> mockFeed = const [
    {
      'type': 'PROJECT',
      'title': 'Cyber Neon - Fast Paced Shooter',
      'content': 'Merhaba arkadaşlar, 6 aydır üzerinde çalıştığım neon temalı cyberpunk FPS oyunumun ilk oynanış videosu ve Steam sayfası yayında. Hızlı hareket mekanikleri ve duvar koşusu ekledim. Unity HDRP kullanarak optimize ettim. Geri bildirimlerinizi bekliyorum!',
      'imageUrl': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      'username': 'Esma',
      'role': 'DEVELOPER',
    },
    {
      'type': 'SOLUTION',
      'title': 'Unity\'de Kamera Titremesi (Jitter) Sorunu Çözümü',
      'content': 'Eğer karakteri FixedUpdate içinde hareket ettirip, kamerayı Update içinde takip ettiriyorsanız bu titreme olur. Çözüm: Kameranın takip kodunu LateUpdate içine taşıyın ve Vector3.Lerp kullanırken delta time çarpanlarına dikkat edin.',
      'username': 'CyberDev',
      'role': 'DEVELOPER',
    },
    {
      'type': 'ROADMAP',
      'title': 'Sıfırdan Pro C# ve Unity Oyun Geliştirme',
      'content': 'Programlama mantığından başlayarak, OOP prensipleri, SOLID kuralları ve Unity\'nin gelişmiş API\'lerini kullanarak profesyonel oyun geliştirme adımlarını bu rehberde topladım. Toplam 12 hafta sürecek bir kamp planıdır.',
      'username': 'CodeNinja',
      'role': 'DEVELOPER',
    },
    {
      'type': 'QUESTION',
      'title': 'Unreal Engine 5 Lumen Optimizasyonu',
      'content': 'Lumen kullanırken kapalı alanlarda ışık sızmaları yaşıyorum. Post process volume üzerinden hangi ayarları kısmalıyım ki performansı çok etkilemeden bu sızmaları engelleyebileyim?',
      'username': 'GamerGirl99',
      'role': 'GAMER',
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GLOBAL AKIŞ'),
        leading: const Icon(Icons.explore),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: AppTheme.neonPink),
            onPressed: () {},
          )
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: mockFeed.length,
        itemBuilder: (context, index) {
          return FeedCard(data: mockFeed[index]);
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppTheme.neonCyan.withOpacity(0.2),
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppTheme.neonCyan, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.add, color: AppTheme.neonCyan),
      ),
    );
  }
}
