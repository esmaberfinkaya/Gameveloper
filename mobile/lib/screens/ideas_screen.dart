import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/cyber_card.dart';

class IdeasScreen extends StatefulWidget {
  const IdeasScreen({super.key});

  @override
  State<IdeasScreen> createState() => _IdeasScreenState();
}

class _IdeasScreenState extends State<IdeasScreen> {
  List<dynamic> ideas = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchIdeas();
  }

  Future<void> fetchIdeas() async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:5000/api/ideas'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          ideas = data;
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
        title: const Text('FİKİR HAVUZU'),
        leading: const Icon(Icons.lightbulb_outline),
        actions: [
          IconButton(
            icon: Icon(Icons.add, color: Theme.of(context).primaryColor),
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
                          fetchIdeas();
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2)),
                        child: Text('Tekrar Dene', style: TextStyle(color: Theme.of(context).primaryColor)),
                      )
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: ideas.length,
                  itemBuilder: (context, index) {
                    final idea = ideas[index];
                    final username = idea['user']?['name'] ?? 'Unknown';
                    final role = idea['user']?['role'] ?? 'GAMER';
                    final category = idea['category'] ?? 'Genel';

                    return CyberCard(
                      glowColor: Theme.of(context).primaryColor,
                      hasGlow: false,
                      borderWidth: 1.5,
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                category.toUpperCase(),
                                style: TextStyle(
                                  color: Theme.of(context).primaryColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  letterSpacing: 1.5,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            idea['title'] ?? '',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            idea['story'] ?? idea['content'] ?? '',
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                              height: 1.5,
                            ),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(2),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: role == 'DEVELOPER' ? Theme.of(context).primaryColor : Theme.of(context).primaryColor,
                                        width: 1.5,
                                      ),
                                    ),
                                    child: const CircleAvatar(
                                      radius: 12,
                                      backgroundColor: Colors.transparent,
                                      child: Icon(Icons.person, size: 16, color: Colors.white),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    username,
                                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  const Icon(Icons.comment, color: Colors.white30, size: 16),
                                  const SizedBox(width: 4),
                                  Text(
                                    (idea['comments']?.length ?? 0).toString(),
                                    style: const TextStyle(color: Colors.white54, fontSize: 12),
                                  ),
                                ],
                              )
                            ],
                          )
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
