import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/cyber_card.dart';

class IssuesScreen extends StatefulWidget {
  const IssuesScreen({super.key});

  @override
  State<IssuesScreen> createState() => _IssuesScreenState();
}

class _IssuesScreenState extends State<IssuesScreen> {
  final List<String> tags = ['Hepsi', '#Unity', '#Blender', '#C#', '#Unreal', '#Godot'];
  String selectedTag = 'Hepsi';

  final List<Map<String, dynamic>> mockIssues = [
    {
      'title': 'NullReferenceException at PlayerMovement.cs',
      'content': 'Karakter zıplama kodunu yazarken Rigidbody bileseni null dönüyor. GetComponent() metodunu Awake icinde cagirdim ama ise yaramadi.',
      'tag': '#Unity',
      'isSolved': true,
      'username': 'CyberDev',
      'role': 'DEVELOPER'
    },
    {
      'title': 'Blender FBX export scale sorunu',
      'content': 'Blender\'dan Unity\'e model aktarirken modelim devasa oluyor. Scale apply yapmama ragmen duzelmedi. Export ayarlarinda neyi gozden kaciriyorum?',
      'tag': '#Blender',
      'isSolved': false,
      'username': 'BlenderMaster',
      'role': 'DEVELOPER'
    },
    {
      'title': 'Lightmap baking cok uzun suruyor',
      'content': 'Sahnemde cok fazla statik obje var, lightmap hesaplamasi saatler suruyor. Progressive GPU kullaniyorum.',
      'tag': '#Unity',
      'isSolved': false,
      'username': 'LevelDesigner',
      'role': 'DEVELOPER'
    }
  ];

  @override
  Widget build(BuildContext context) {
    final filteredIssues = selectedTag == 'Hepsi'
        ? mockIssues
        : mockIssues.where((issue) => issue['tag'] == selectedTag).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('SORUNLAR'),
        leading: const Icon(Icons.bug_report),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: AppTheme.neonCyan),
            onPressed: () {},
          )
        ],
      ),
      body: Column(
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
                      color: isSelected ? AppTheme.neonCyan.withOpacity(0.2) : Colors.transparent,
                      border: Border.all(
                        color: isSelected ? AppTheme.neonCyan : Colors.white30,
                        width: 1.5,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: isSelected ? AppTheme.getGlow(AppTheme.neonCyan, blur: 5) : [],
                    ),
                    child: Text(
                      tag,
                      style: TextStyle(
                        color: isSelected ? AppTheme.neonCyan : Colors.white70,
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
                final isSolved = issue['isSolved'] as bool;

                return CyberCard(
                  glowColor: isSolved ? AppTheme.neonGreen : AppTheme.neonPink,
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
                            issue['tag'],
                            style: const TextStyle(
                              color: AppTheme.accentPurple,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              letterSpacing: 1.5,
                            ),
                          ),
                          if (isSolved)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.neonGreen.withOpacity(0.2),
                                border: Border.all(color: AppTheme.neonGreen),
                                borderRadius: BorderRadius.circular(4),
                                boxShadow: AppTheme.getGlow(AppTheme.neonGreen, blur: 8),
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.check, color: AppTheme.neonGreen, size: 12),
                                  SizedBox(width: 4),
                                  Text(
                                    'SOLVED',
                                    style: TextStyle(
                                      color: AppTheme.neonGreen,
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
                      
                      // Issue Title
                      Text(
                        issue['title'],
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 8),
                      
                      // Issue Content
                      Text(
                        issue['content'],
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 14,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      Divider(color: Colors.white.withOpacity(0.1)),
                      const SizedBox(height: 8),
                      
                      // Footer: User and Actions
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 12,
                                backgroundColor: Colors.white10,
                                child: Text(
                                  issue['username'][0],
                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                issue['username'],
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),
                          Row(
                            children: const [
                              Icon(Icons.mode_comment_outlined, color: Colors.white70, size: 16),
                              SizedBox(width: 4),
                              Text('Yanıtla', style: TextStyle(color: Colors.white70, fontSize: 12)),
                            ],
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
        backgroundColor: AppTheme.neonPink.withOpacity(0.2),
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppTheme.neonPink, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.add, color: AppTheme.neonPink),
      ),
    );
  }
}
