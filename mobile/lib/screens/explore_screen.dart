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
      'type': 'QUESTION',
      'title': 'NullReferenceException at PlayerMovement.cs',
      'content': 'Karakter zıplama kodunu yazarken Rigidbody bileseni null dönüyor. GetComponent() metodunu Awake icinde cagirdim ama ise yaramadi.',
      'username': 'CyberDev',
      'role': 'DEVELOPER',
    },
    {
      'type': 'IDEA',
      'title': 'Zamanı Donduran Kılıç Ustası',
      'content': 'Ana karakter zamanı yavaşlatabiliyor ancak hareket ettikçe kendi canı azalıyor. Karanlık ve neon ışıklı bir metropolis, low poly karakter tasarımı. Hack and slash mekanikleri ve ritim tabanlı combo sistemi.',
      'username': 'AlphaGamer',
      'role': 'GAMER',
    },
    {
      'type': 'PROJECT',
      'title': 'Sci-Fi Koridor Render',
      'content': 'Blender Eevee kullanarak hazırladığım yeni çevre tasarımı. Işıklandırma konusunda fikirlerinizi merak ediyorum.',
      'imageUrl': 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2070&auto=format&fit=crop',
      'username': 'BlenderMaster',
      'role': 'DEVELOPER',
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
