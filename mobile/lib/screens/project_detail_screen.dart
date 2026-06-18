import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';
import '../theme/app_theme.dart';

class ProjectDetailScreen extends StatelessWidget {
  final Map<String, dynamic> project;

  const ProjectDetailScreen({super.key, required this.project});

  Future<void> _launchUrl(String? urlString) async {
    if (urlString == null || urlString.isEmpty) return;
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url)) {
      debugPrint('Could not launch $urlString');
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = project['title'] ?? 'Proje Detayı';
    final summary = project['summary'] ?? '';
    final youtubeUrl = project['youtubeUrl'];
    final storeUrl = project['storeUrl'];
    final images = project['images'];

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: const Color(0xFF12121A),
        title: Text(title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2)),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (images != null && images.toString().isNotEmpty)
              Container(
                height: 250,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: MemoryImage(base64Decode(images.toString().split(',').last)),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [Colors.black.withOpacity(0.8), Colors.transparent],
                    ),
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('PROJE ÖZETİ', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, letterSpacing: 2, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(summary, style: const TextStyle(color: Colors.white, fontSize: 16, height: 1.5)),
                  const SizedBox(height: 32),
                  if (youtubeUrl != null && youtubeUrl.toString().isNotEmpty) ...[
                    ElevatedButton.icon(
                      onPressed: () => _launchUrl(youtubeUrl),
                      icon: const Icon(Icons.play_circle_fill, color: Colors.white),
                      label: const Text('YouTube\'da İzle', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red[700],
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        minimumSize: const Size.fromHeight(50),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                  if (storeUrl != null && storeUrl.toString().isNotEmpty) ...[
                    ElevatedButton.icon(
                      onPressed: () => _launchUrl(storeUrl),
                      icon: const Icon(Icons.storefront, color: Colors.white),
                      label: const Text('Mağazaya Git', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        minimumSize: const Size.fromHeight(50),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
