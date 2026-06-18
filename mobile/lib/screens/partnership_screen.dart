import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/cyber_card.dart';

class PartnershipScreen extends StatelessWidget {
  PartnershipScreen({super.key});

  final List<Map<String, dynamic>> mockPartnerships = [
    {
      'title': 'Sci-Fi Çevre Tasarımı İçin Yardım',
      'description': 'Unity HDRP kullanarak geliştirdiğim projede sci-fi koridor ve dış mekan modellemeleri yapacak bir 3D artist arıyorum.',
      'requiredRole': '3D ARTIST',
      'username': 'BlenderMaster',
      'trustScore': 2450,
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
        title: Text('BOUNTY BOARD'),
        leading: Icon(Icons.group_add),
        actions: [
          IconButton(
            icon: Icon(Icons.sort, color: Theme.of(context).primaryColor),
            onPressed: () {},
          )
        ],
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(16.0),
        itemCount: mockPartnerships.length,
        itemBuilder: (context, index) {
          final item = mockPartnerships[index];
          final isUrgent = item['isUrgent'] as bool;

          return CyberCard(
            glowColor: Theme.of(context).primaryColor,
            hasGlow: true,
            borderWidth: 2,
            padding: EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header: Required Role Badge & Urgent Tag
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor.withOpacity(0.1),
                        border: Border.all(color: Theme.of(context).primaryColor),
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 10),
                      ),
                      child: Text(
                        item['requiredRole'],
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ),
                    if (isUrgent)
                      Row(
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
                SizedBox(height: 16),
                
                // Title
                Text(
                  item['title'],
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
                SizedBox(height: 12),
                
                // Description
                Text(
                  item['description'],
                  style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                SizedBox(height: 24),
                
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
                                style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ),
                            SizedBox(width: 6),
                            Text(
                              item['username'],
                              style: TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.bolt, color: Theme.of(context).primaryColor, size: 16),
                            SizedBox(width: 4),
                            Text(
                              'Trust Score: ${item['trustScore']}',
                              style: TextStyle(
                                color: Theme.of(context).primaryColor,
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
                      onPressed: () => _showChatBottomSheet(context, item),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
                        foregroundColor: Theme.of(context).primaryColor,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          side: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: Text(
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
        backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: Theme.of(context).primaryColor, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Icon(Icons.add, color: Theme.of(context).primaryColor),
      ),
    );
  }

  void _showChatBottomSheet(BuildContext context, Map<String, dynamic> item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            color: const Color(0xFF05070A),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(
              top: BorderSide(color: Theme.of(context).primaryColor, width: 2),
            ),
            boxShadow: [
              BoxShadow(
                color: Theme.of(context).primaryColor.withOpacity(0.2),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5))),
                  color: const Color(0xFF0D1117),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Theme.of(context).primaryColor.withOpacity(0.2),
                            border: Border.all(color: Theme.of(context).primaryColor),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Text(
                              item['username'][0],
                              style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item['username'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).primaryColor,
                                    shape: BoxShape.circle,
                                    boxShadow: [BoxShadow(color: Theme.of(context).primaryColor, blurRadius: 5)],
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'ONLINE',
                                  style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 10, letterSpacing: 2),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white54),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              // Chat Area
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text(
                        '< SECURE CONNECTION ESTABLISHED >',
                        style: TextStyle(color: Colors.white30, fontSize: 10, fontFamily: 'monospace'),
                      ),
                      const SizedBox(height: 16),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(right: 50, bottom: 16),
                          padding: const EdgeInsets.all(12),
                          decoration: const BoxDecoration(
                            color: Colors.white10,
                            borderRadius: BorderRadius.only(
                              topRight: Radius.circular(16),
                              bottomRight: Radius.circular(16),
                              bottomLeft: Radius.circular(16),
                            ),
                            border: Border(left: BorderSide(color: Colors.white30, width: 2)),
                          ),
                          child: const Text(
                            'Selam! İlanıma başvurduğun için teşekkürler. Portfolyonu inceleyebilir miyim?',
                            style: TextStyle(color: Colors.white70, fontSize: 14),
                          ),
                        ),
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          margin: const EdgeInsets.only(left: 50, bottom: 16),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Theme.of(context).primaryColor.withOpacity(0.1),
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(16),
                              bottomLeft: Radius.circular(16),
                              bottomRight: Radius.circular(16),
                            ),
                            border: Border(right: BorderSide(color: Theme.of(context).primaryColor, width: 2)),
                          ),
                          child: Text(
                            'Merhaba! Tabi, hemen gönderiyorum: github.com/gameveloper',
                            style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 14),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Input
              Container(
                padding: EdgeInsets.only(
                  left: 16, right: 16, top: 16,
                  bottom: MediaQuery.of(context).viewInsets.bottom + 16,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF0D1117),
                  border: Border(top: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5))),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        style: TextStyle(color: Theme.of(context).primaryColor, fontFamily: 'monospace', fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Mesajını yaz terminale...',
                          hintStyle: TextStyle(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                          filled: true,
                          fillColor: Colors.black,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(color: Colors.white24),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Theme.of(context).primaryColor),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 10),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.send, color: Colors.black),
                        onPressed: () {},
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
