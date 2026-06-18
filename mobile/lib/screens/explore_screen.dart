import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/feed_card.dart';
import '../theme/app_theme.dart';
import 'package:shared_preferences/shared_preferences.dart';


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

  void _showAddQuestionModal() {
    String title = '';
    String content = '';
    String category = 'Unity';
    String suggestedCategory = '';
    String githubLink = '';
    String codeSnippet = '';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.background,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 16,
            right: 16,
            top: 24,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('YENİ SORU / SORUN', style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 2)),
                SizedBox(height: 16),
                
                TextField(
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'Başlık',
                    labelStyle: TextStyle(color: Colors.white54),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Theme.of(context).primaryColor)),
                  ),
                  onChanged: (val) => title = val,
                ),
                SizedBox(height: 16),
                
                TextField(
                  style: TextStyle(color: Colors.white),
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: 'Detaylar',
                    labelStyle: TextStyle(color: Colors.white54),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Theme.of(context).primaryColor)),
                  ),
                  onChanged: (val) => content = val,
                ),
                SizedBox(height: 16),
                
                TextField(
                  style: TextStyle(color: Theme.of(context).primaryColor, fontFamily: 'monospace'),
                  maxLines: 4,
                  decoration: InputDecoration(
                    labelText: 'Hızlı Kod Bloğu (Max 150 Satır)',
                    labelStyle: TextStyle(color: Colors.white54),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Theme.of(context).primaryColor)),
                  ),
                  onChanged: (val) => codeSnippet = val,
                ),
                SizedBox(height: 16),
                
                TextField(
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'GitHub Linki (Opsiyonel)',
                    labelStyle: TextStyle(color: Colors.white54),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Theme.of(context).primaryColor)),
                  ),
                  onChanged: (val) => githubLink = val,
                ),
                SizedBox(height: 16),
                
                TextField(
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'Kategori Öner',
                    labelStyle: TextStyle(color: Colors.white54),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Theme.of(context).primaryColor)),
                  ),
                  onChanged: (val) => suggestedCategory = val,
                ),
                SizedBox(height: 24),
                
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
                      padding: EdgeInsets.symmetric(vertical: 16),
                      side: BorderSide(color: Theme.of(context).primaryColor),
                    ),
                    onPressed: () async {
                      if (codeSnippet.split('\n').length > 150) {
                         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hızlı kod bloğu maksimum 150 satır olabilir!')));
                         return;
                      }

                      final prefs = await SharedPreferences.getInstance();
                      final userId = prefs.getInt('userId') ?? 1;

                      try {
                        final res = await http.post(
                          Uri.parse('http://10.0.2.2:5000/api/questions'),
                          headers: {'Content-Type': 'application/json'},
                          body: json.encode({
                            'title': title,
                            'content': content,
                            'category': category,
                            'suggestedCategory': suggestedCategory,
                            'githubLink': githubLink,
                            'codeSnippet': codeSnippet,
                            'userId': userId,
                          }),
                        );
                        
                        if (res.statusCode == 201) {
                          Navigator.pop(context);
                          fetchFeed();
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Ekleme başarısız.')));
                        }
                      } catch (e) {
                         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
                      }
                    },
                    child: Text('GÖNDER', style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold)),
                  ),
                ),
                SizedBox(height: 32),
              ],
            ),
          ),
        );
      },
    );
  }

  @override

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GLOBAL AKIŞ'),
        leading: const Icon(Icons.explore),
        actions: [
          IconButton(
            icon: Icon(Icons.filter_list, color: Theme.of(context).primaryColor),
            onPressed: () {},
          )
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator(color: Theme.of(context).primaryColor))
          : error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline, color: Theme.of(context).primaryColor, size: 48),
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
                        style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2)),
                        child: Text('Tekrar Dene', style: TextStyle(color: Theme.of(context).primaryColor)),
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
        onPressed: _showAddQuestionModal,
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
}
