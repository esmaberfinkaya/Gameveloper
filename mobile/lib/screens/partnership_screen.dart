import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/cyber_card.dart';

class PartnershipScreen extends StatelessWidget {
  const PartnershipScreen({super.key});

  final List<Map<String, dynamic>> mockPartnerships = const [
    {
      'title': 'Cyber Neon Projesi İçin 3D Artist Aranıyor',
      'description': 'Unity HDRP kullanarak geliştirdiğim cyberpunk FPS oyunum için silah ve karakter modellemeleri yapacak bir 3D artist arıyorum. Gelir paylaşımı modeli ile çalışılacaktır.',
      'requiredRole': '3D ARTIST',
      'username': 'Esma',
      'trustScore': 1250,
      'isUrgent': true,
    },
    {
      'title': 'Pixel Art Metroidvania - Müzisyen / Ses Tasarımcısı',
      'description': '2D pixel art tarzındaki metroidvania oyunumuz için karanlık ve atmosferik müzikler yapabilecek bir ekip arkadaşı arıyoruz.',
      'requiredRole': 'SOUND DESIGNER',
      'username': 'PixelGamer',
      'trustScore': 840,
      'isUrgent': false,
    },
    {
      'title': 'Multiplayer Kart Oyunu İçin Backend Developer',
      'description': 'Node.js ve Socket.io kullanarak gerçek zamanlı bir multiplayer kart oyunu geliştiriyoruz. Backend tarafında deneyimli bir yazılımcıya ihtiyacımız var.',
      'requiredRole': 'BACKEND DEV',
      'username': 'CodeNinja',
      'trustScore': 2100,
      'isUrgent': true,
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BOUNTY BOARD'),
        leading: const Icon(Icons.group_add),
        actions: [
          IconButton(
            icon: const Icon(Icons.sort, color: AppTheme.neonYellow),
            onPressed: () {},
          )
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: mockPartnerships.length,
        itemBuilder: (context, index) {
          final item = mockPartnerships[index];
          final isUrgent = item['isUrgent'] as bool;

          return CyberCard(
            glowColor: AppTheme.neonYellow,
            hasGlow: true,
            borderWidth: 2,
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header: Required Role Badge & Urgent Tag
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.neonYellow.withOpacity(0.1),
                        border: Border.all(color: AppTheme.neonYellow),
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: AppTheme.getGlow(AppTheme.neonYellow, blur: 10),
                      ),
                      child: Text(
                        item['requiredRole'],
                        style: const TextStyle(
                          color: AppTheme.neonYellow,
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ),
                    if (isUrgent)
                      const Row(
                        children: [
                          Icon(Icons.local_fire_department, color: Colors.deepOrangeAccent, size: 16),
                          SizedBox(width: 4),
                          Text(
                            'URGENT',
                            style: TextStyle(
                              color: Colors.deepOrangeAccent,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Title
                Text(
                  item['title'],
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 12),
                
                // Description
                Text(
                  item['description'],
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 24),
                
                // Footer: Trust Score & Apply Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // Trust Score Box
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 10,
                              backgroundColor: Colors.white10,
                              child: Text(
                                item['username'][0],
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              item['username'],
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.bolt, color: AppTheme.neonCyan, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              'Trust Score: ${item['trustScore']}',
                              style: const TextStyle(
                                color: AppTheme.neonCyan,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    
                    // Apply Button
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.neonYellow.withOpacity(0.2),
                        foregroundColor: AppTheme.neonYellow,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          side: const BorderSide(color: AppTheme.neonYellow, width: 2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: const Text(
                        'BAŞVUR',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppTheme.neonYellow.withOpacity(0.2),
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppTheme.neonYellow, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.add, color: AppTheme.neonYellow),
      ),
    );
  }
}
