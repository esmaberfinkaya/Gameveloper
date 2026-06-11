import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/cyber_card.dart';
import '../widgets/feed_card.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  final int userId;
  
  ProfileScreen({
    super.key,
    this.userId = 1, // Defaulting to Esma
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? userData;
  List<dynamic> userPosts = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    try {
      final userRes = await http.get(Uri.parse('http://10.0.2.2:5000/api/users/${widget.userId}'));
      final exploreRes = await http.get(Uri.parse('http://10.0.2.2:5000/api/explore?userId=${widget.userId}'));
      
      if (userRes.statusCode == 200 && exploreRes.statusCode == 200) {
        final Map<String, dynamic> userJson = json.decode(userRes.body);
        final List<dynamic> exploreJson = json.decode(exploreRes.body);
        
        final myPosts = exploreJson.where((p) => p['userId'] == widget.userId).toList();
        
        setState(() {
          userData = userJson;
          userPosts = myPosts;
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Sunucuya ulaşılamadı.';
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
    if (isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator(color: Theme.of(context).primaryColor)),
      );
    }
    
    if (error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, color: Theme.of(context).primaryColor, size: 48),
              SizedBox(height: 16),
              Text(error!, style: TextStyle(color: Colors.white70)),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    isLoading = true;
                    error = null;
                  });
                  fetchData();
                },
                style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2)),
                child: Text('Tekrar Dene', style: TextStyle(color: Theme.of(context).primaryColor)),
              )
            ],
          ),
        ),
      );
    }

    final username = userData?['name'] ?? 'UNKNOWN';
    final role = userData?['role'] ?? 'GAMER';
    final trustScore = userData?['trustScore'] ?? 0;
    
    int solvedIssues = 0;
    int completedProjects = role == 'DEVELOPER' ? 4 : 1; // Defaulting for demo
    
    // Count resolved questions from posts
    for (var post in userPosts) {
      if (post['feedType'] == 'QUESTION' && post['isResolved'] == true) {
        solvedIssues++;
      }
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // AppBar
          SliverAppBar(
            expandedHeight: 250.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.background,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                username.toUpperCase(),
                style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 4),
              ),
              centerTitle: true,
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      gradient: RadialGradient(
                        colors: [Color(0xFF2A0A4A), AppTheme.background],
                        radius: 1.0,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 60,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Theme.of(context).primaryColor, width: 3),
                          boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 20),
                          color: AppTheme.background,
                        ),
                        child: Center(
                          child: Text(
                            username.isNotEmpty ? username[0].toUpperCase() : '?',
                            style: TextStyle(
                              fontSize: 40,
                              fontWeight: FontWeight.w900,
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 60,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor.withOpacity(0.1),
                          border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          role.toUpperCase(),
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              IconButton(icon: Icon(Icons.settings), onPressed: () {}),
            ],
          ),
          
          // Bento Grid using SliverGrid
          SliverPadding(
            padding: EdgeInsets.all(16.0),
            sliver: SliverGrid.count(
              crossAxisCount: 2,
              mainAxisSpacing: 16.0,
              crossAxisSpacing: 16.0,
              children: [
                // Trust Score Box
                CyberCard(
                  glowColor: Theme.of(context).primaryColor,
                  hasGlow: true,
                  borderWidth: 2,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.bolt, color: Theme.of(context).primaryColor, size: 36),
                      SizedBox(height: 8),
                      Text(
                        'TRUST SCORE',
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 10,
                          letterSpacing: 1.5,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        trustScore.toString(),
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          shadows: AppTheme.getGlow(Theme.of(context).primaryColor, spread: 0, blur: 10),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Secondary Stats Grid inside a card
                CyberCard(
                  glowColor: Theme.of(context).primaryColor,
                  hasGlow: false,
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: [
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            border: Border(bottom: BorderSide(color: Colors.white10)),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(solvedIssues.toString(), style: TextStyle(color: AppTheme.textPrimary, fontSize: 24, fontWeight: FontWeight.bold)),
                                Text('Çözülen Sorun', style: TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(completedProjects.toString(), style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 24, fontWeight: FontWeight.bold)),
                              Text('Tamamlanan Proje', style: TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Achievements Banner (Span across) - Handled below via SliverToBoxAdapter
              ],
            ),
          ),
          
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: CyberCard(
                glowColor: Theme.of(context).primaryColor,
                hasGlow: true,
                padding: EdgeInsets.all(20),
                child: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor.withOpacity(0.1),
                        shape: BoxShape.circle,
                        border: Border.all(color: Theme.of(context).primaryColor),
                      ),
                      child: Icon(Icons.emoji_events, color: Theme.of(context).primaryColor),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Erken Erişim Üyesi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          SizedBox(height: 4),
                          Text('Platformun ilk 100 kullanıcısından biri.', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Content Title
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.only(left: 16.0, right: 16.0, top: 32.0, bottom: 8.0),
              child: Text(
                'SON PAYLAŞIMLAR',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),
            ),
          ),

          userPosts.isEmpty
              ? SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Container(
                      height: 150,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.white12, style: BorderStyle.solid),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.dashboard_customize, color: Colors.white24, size: 48),
                            SizedBox(height: 16),
                            Text('Henüz hiçbir içerik paylaşılmadı.', style: TextStyle(color: Colors.white54)),
                          ],
                        ),
                      ),
                    ),
                  ),
                )
              : SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final item = userPosts[index];
                      return Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                        child: FeedCard(data: {
                          'type': item['feedType'],
                          'title': item['title'],
                          'content': item['content'] ?? item['description'] ?? item['story'] ?? '',
                          'imageUrl': item['imageUrl'],
                          'username': item['user']?['name'] ?? 'Unknown',
                          'role': item['user']?['role'] ?? 'GAMER',
                        }),
                      );
                    },
                    childCount: userPosts.length,
                  ),
                ),
          
          SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}
