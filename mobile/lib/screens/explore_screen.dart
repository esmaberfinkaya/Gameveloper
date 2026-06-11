import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/feed_card.dart';
import '../theme/app_theme.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  List<dynamic> feed = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchFeed();
  }

  Future<void> fetchFeed() async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:5000/api/explore'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          feed = data;
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Sunucuya ulaşılamadı. Kod: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Bağlantı hatası: $e';
        isLoading = false;
      });
    }
  }

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
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.neonCyan))
          : error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, color: AppTheme.neonPink, size: 48),
                      const SizedBox(height: 16),
                      Text(error!, style: const TextStyle(color: Colors.white70)),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            isLoading = true;
                            error = null;
                          });
                          fetchFeed();
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.neonPink.withOpacity(0.2)),
                        child: const Text('Tekrar Dene', style: TextStyle(color: AppTheme.neonPink)),
                      )
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: feed.length,
                  itemBuilder: (context, index) {
                    final item = feed[index];
                    return FeedCard(data: {
                      'type': item['feedType'],
                      'title': item['title'],
                      'content': item['content'] ?? item['description'] ?? item['story'] ?? '',
                      'imageUrl': item['imageUrl'],
                      'username': item['user']?['name'] ?? 'Unknown',
                      'role': item['user']?['role'] ?? 'GAMER',
                    });
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
