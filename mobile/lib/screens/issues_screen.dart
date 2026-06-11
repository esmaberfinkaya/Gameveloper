import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';
import '../widgets/cyber_card.dart';
import '../widgets/access_gate.dart';

class IssuesScreen extends StatefulWidget {
  const IssuesScreen({super.key});

  @override
  State<IssuesScreen> createState() => _IssuesScreenState();
}

class _IssuesScreenState extends State<IssuesScreen> {
  final List<String> tags = ['Hepsi', '#Unity', '#Blender', '#C#', '#Unreal', '#Godot'];
  String selectedTag = 'Hepsi';
  
  List<dynamic> issues = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchIssues();
  }

  Future<void> fetchIssues() async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:5000/api/issues'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          issues = data;
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
  Widget build(BuildContext context) {
    final filteredIssues = selectedTag == 'Hepsi'
        ? issues
        : issues.where((issue) {
            final category = issue['category'] as String?;
            final tag = category != null ? '#$category' : '#Genel';
            return tag == selectedTag;
          }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('SORUNLAR'),
        leading: const Icon(Icons.bug_report),
        actions: [
          IconButton(
            icon: Icon(Icons.search, color: Theme.of(context).primaryColor),
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
                          fetchIssues();
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2)),
                        child: Text('Tekrar Dene', style: TextStyle(color: Theme.of(context).primaryColor)),
                      )
                    ],
                  ),
                )
              : Column(
                  children: [
          // Horizontal Tags
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              itemCount: tags.length,
              itemBuilder: (context, index) {
                final tag = tags[index];
                final isSelected = tag == selectedTag;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedTag = tag;
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.only(right: 12.0),
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
                    decoration: BoxDecoration(
                      color: isSelected ? Theme.of(context).primaryColor.withOpacity(0.2) : Colors.transparent,
                      border: Border.all(
                        color: isSelected ? Theme.of(context).primaryColor : Colors.white30,
                        width: 1.5,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: isSelected ? AppTheme.getGlow(Theme.of(context).primaryColor, blur: 5) : [],
                    ),
                    child: Text(
                      tag,
                      style: TextStyle(
                        color: isSelected ? Theme.of(context).primaryColor : Colors.white70,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Issues List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: filteredIssues.length,
              itemBuilder: (context, index) {
                final issue = filteredIssues[index];
                final isSolved = issue['isResolved'] == true;
                final tag = issue['category'] != null ? '#${issue['category']}' : '#Genel';
                final username = issue['user']?['name'] ?? 'Unknown';
                final role = issue['user']?['role'] ?? 'GAMER';

                return CyberCard(
                  glowColor: isSolved ? Theme.of(context).primaryColor : Theme.of(context).primaryColor,
                  hasGlow: isSolved, // Add glow only if solved to highlight it, or maybe on both. Let's do both but different colors.
                  borderWidth: 1.5,
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Row: Tag and Status
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            tag,
                            style: TextStyle(
                              color: Theme.of(context).primaryColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              letterSpacing: 1.5,
                            ),
                          ),
                          if (isSolved)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Theme.of(context).primaryColor.withOpacity(0.2),
                                border: Border.all(color: Theme.of(context).primaryColor),
                                borderRadius: BorderRadius.circular(4),
                                boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 8),
                              ),
                              child: Row(
                                children: [
                                  Icon(Icons.check, color: Theme.of(context).primaryColor, size: 12),
                                  SizedBox(width: 4),
                                  Text(
                                    'SOLVED',
                                    style: TextStyle(
                                      color: Theme.of(context).primaryColor,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      
                      // Issue
                      Text(
                        issue['title'] ?? '',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        issue['content'] ?? '',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                          height: 1.5,
                        ),
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 20),
                      // Footer: User and Interactions
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
                          AccessGate(
                            allowedRoles: ['DEVELOPER'],
                            child: Row(
                              children: [
                                Icon(Icons.mode_comment_outlined, color: Colors.white70, size: 16),
                                SizedBox(width: 4),
                                Text('Yanıtla', style: TextStyle(color: Colors.white70, fontSize: 12)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
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
}
