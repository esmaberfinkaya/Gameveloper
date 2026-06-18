import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/feed_card.dart';
import '../widgets/project_share_bottom_sheet.dart';
import '../theme/app_theme.dart';
import 'package:image_picker/image_picker.dart';

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
  bool isLoading = true;
  String? error;
  String activeFilter = 'issues';

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    try {
      final userRes = await http.get(Uri.parse('http://10.0.2.2:5000/api/users/${widget.userId}'));
      
      if (userRes.statusCode == 200) {
        final Map<String, dynamic> userJson = json.decode(userRes.body);
        
        setState(() {
          userData = userJson;
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

  Future<void> _pickAndUploadAvatar() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery, imageQuality: 50);
    
    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      
      if (bytes.length > 2 * 1024 * 1024) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Dosya boyutu 2MB\'den küçük olmalıdır.')));
        return;
      }
      
      final base64String = 'data:image/jpeg;base64,' + base64Encode(bytes);
      
      try {
        final res = await http.patch(
          Uri.parse('http://10.0.2.2:5000/api/users/${widget.userId}/avatar'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'avatar': base64String}),
        );
        
        if (res.statusCode == 200) {
          setState(() {
            userData?['avatar'] = base64String;
          });
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Avatar başarıyla güncellendi!')));
        } else {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Avatar yüklenemedi: ${res.body}')));
        }
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Bağlantı hatası')));
      }
    }
  }


  Widget _buildFilterButton(String filterId, String text) {
    final isActive = activeFilter == filterId;
    return GestureDetector(
      onTap: () {
        setState(() {
          activeFilter = filterId;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? Theme.of(context).primaryColor.withOpacity(0.2) : Colors.transparent,
          border: Border.all(color: isActive ? Theme.of(context).primaryColor : Colors.white24),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: isActive ? Theme.of(context).primaryColor : Colors.white54,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
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
    
    final issuesList = userData?['issues'] as List<dynamic>? ?? [];
    final ideasList = userData?['ideas'] as List<dynamic>? ?? [];
    final partnershipsList = userData?['partnerships'] as List<dynamic>? ?? [];
    final projectsList = userData?['projects'] as List<dynamic>? ?? [];

    List<dynamic> currentList = [];
    if (activeFilter == 'issues') currentList = issuesList;
    if (activeFilter == 'ideas') currentList = ideasList;
    if (activeFilter == 'partnerships') currentList = partnershipsList;
    if (activeFilter == 'projects') currentList = projectsList;
    
    int solvedIssues = 0;
    int completedProjects = role == 'DEVELOPER' ? 4 : 1; 
    
    for (var post in issuesList) {
      if (post['isResolved'] == true) {
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
                      child: GestureDetector(
                        onTap: () => _pickAndUploadAvatar(),
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Theme.of(context).primaryColor, width: 3),
                            boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 20),
                            color: AppTheme.background,
                            image: userData?['avatar'] != null ? DecorationImage(
                              image: MemoryImage(base64Decode(userData!['avatar'].split(',').last)),
                              fit: BoxFit.cover,
                            ) : null,
                          ),
                          child: userData?['avatar'] == null ? Center(
                            child: Text(
                              username.isNotEmpty ? username[0].toUpperCase() : '?',
                              style: TextStyle(
                                fontSize: 40,
                                fontWeight: FontWeight.w900,
                                color: Theme.of(context).primaryColor,
                              ),
                            ),
                          ) : null,
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
                // Trust Score Box (Battery Indicator Style)
                CyberCard(
                  glowColor: Theme.of(context).primaryColor,
                  hasGlow: true,
                  borderWidth: 2,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Icon(Icons.battery_charging_full, color: Theme.of(context).primaryColor, size: 28),
                          SizedBox(width: 4),
                          Text(
                            trustScore.toString(),
                            style: TextStyle(
                              color: Theme.of(context).primaryColor,
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                              shadows: AppTheme.getGlow(Theme.of(context).primaryColor, spread: 0, blur: 10),
                            ),
                          ),
                          Text(
                            '%',
                            style: TextStyle(
                              color: Theme.of(context).primaryColor.withOpacity(0.5),
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      // Battery Bars
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(5, (index) {
                          double threshold = (index + 1) * 20.0;
                          bool isActive = trustScore >= threshold - 10;
                          return Container(
                            margin: EdgeInsets.symmetric(horizontal: 2),
                            width: 16,
                            height: 6,
                            decoration: BoxDecoration(
                              color: isActive ? Theme.of(context).primaryColor : Colors.white10,
                              borderRadius: BorderRadius.circular(2),
                              boxShadow: isActive ? AppTheme.getGlow(Theme.of(context).primaryColor, blur: 5) : [],
                            ),
                          );
                        }),
                      ),
                      SizedBox(height: 12),
                      Text(
                        'TRUST SCORE',
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 10,
                          letterSpacing: 1.5,
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
              padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 32.0, bottom: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'KENDİ PAYLAŞIMLARIM',
                        style: TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2,
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (context) => ProjectShareBottomSheet(
                              userId: widget.userId,
                              onSuccess: () => fetchData(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.add_box, color: Colors.black, size: 16),
                        label: const Text('PROJE PAYLAŞ', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 10)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterButton('issues', 'SORUNLARIM'),
                        const SizedBox(width: 8),
                        _buildFilterButton('ideas', 'FİKİRLERİM'),
                        const SizedBox(width: 8),
                        _buildFilterButton('partnerships', 'İLANLARIM'),
                        const SizedBox(width: 8),
                        _buildFilterButton('projects', 'PROJELERİM'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          currentList.isEmpty
              ? SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Container(
                      height: 150,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.white12, style: BorderStyle.solid),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.dashboard_customize, color: Colors.white24, size: 48),
                            SizedBox(height: 16),
                            Text('Bu kategoride içerik bulunmuyor.', style: TextStyle(color: Colors.white54)),
                          ],
                        ),
                      ),
                    ),
                  ),
                )
              : SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final item = currentList[index];
                      if (activeFilter == 'partnerships') {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                          child: CyberCard(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['title'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                                const SizedBox(height: 8),
                                Text(item['description'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 14)),
                                const SizedBox(height: 12),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                                    border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    item['requiredRole'] ?? '',
                                    style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }

                      if (activeFilter == 'projects') {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                          child: GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(context, '/project_detail', arguments: item);
                            },
                            child: CyberCard(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (item['images'] != null && item['images'].toString().isNotEmpty)
                                    Container(
                                      height: 150,
                                      width: double.infinity,
                                      margin: EdgeInsets.only(bottom: 12),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(8),
                                        image: DecorationImage(
                                          image: MemoryImage(base64Decode(item['images'].toString().split(',').last)),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                  Text(item['title'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                                  const SizedBox(height: 8),
                                  Text(item['summary'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.white70, fontSize: 14)),
                                ],
                              ),
                            ),
                          ),
                        );
                      }
                      
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                        child: FeedCard(data: {
                          'type': activeFilter == 'issues' ? 'QUESTION' : 'IDEA',
                          'title': item['title'],
                          'content': item['content'] ?? item['description'] ?? item['story'] ?? '',
                          'imageUrl': item['imageUrl'],
                          'username': username,
                          'role': role,
                        }),
                      );
                    },
                    childCount: currentList.length,
                  ),
                ),
          
          SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}
