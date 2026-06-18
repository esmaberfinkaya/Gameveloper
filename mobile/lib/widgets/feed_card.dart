import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:share_plus/share_plus.dart';
import 'cyber_card.dart';
import '../theme/app_theme.dart';

class FeedCard extends StatefulWidget {
  final Map<String, dynamic> data;

  const FeedCard({super.key, required this.data});

  @override
  State<FeedCard> createState() => _FeedCardState();
}

class _FeedCardState extends State<FeedCard> {
  bool isLiked = false;
  bool isExpanded = false;
  int? openStepIndex;

  Future<void> handleLike() async {
    try {
      final res = await http.post(
        Uri.parse('http://10.0.2.2:5000/api/like'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'userId': 1, 'postId': widget.data['id']}),
      );
      if (res.statusCode == 200) {
        setState(() => isLiked = true);
      }
    } catch (e) {
      print(e);
    }
  }

  void handleShare() {
    Share.share('Bu projeye/içeriğe göz at: ${widget.data['title']} - Gameveloper\'da gör!');
  }

  @override
  Widget build(BuildContext context) {
    final data = widget.data;
    final type = data['type'] ?? 'UNKNOWN';
    final title = data['title'] ?? '';
    final content = data['content'] ?? '';
    final imageUrl = data['imageUrl'];
    final username = data['username'] ?? 'Anonim';
    final role = data['role'] ?? 'DEVELOPER';

    Color getTypeColor() {
      switch (type) {
        case 'PROJECT':
          return Theme.of(context).primaryColor;
        case 'ROADMAP':
          return Theme.of(context).primaryColor;
        case 'SOLUTION':
          return Theme.of(context).primaryColor;
        case 'QUESTION':
          return Theme.of(context).primaryColor;
        default:
          return Theme.of(context).primaryColor;
      }
    }

    return CyberCard(
      glowColor: getTypeColor(),
      hasGlow: true,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Banner Image (if available)
          if (imageUrl != null)
            Container(
              height: 160,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.black.withOpacity(0.9),
                      Colors.transparent,
                    ],
                  ),
                ),
                alignment: Alignment.bottomLeft,
                padding: const EdgeInsets.all(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    border: Border.all(color: getTypeColor()),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    type,
                    style: TextStyle(
                      color: getTypeColor(),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                  ),
                ),
              ),
            )
          else
            // Header if no image
            Padding(
              padding: const EdgeInsets.all(16.0).copyWith(bottom: 0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: getTypeColor().withOpacity(0.1),
                      border: Border.all(color: getTypeColor()),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      type,
                      style: TextStyle(
                        color: getTypeColor(),
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            ),

          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User Info
                Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: getTypeColor().withOpacity(0.2),
                      child: Text(
                        username[0].toUpperCase(),
                        style: TextStyle(
                          color: getTypeColor(),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            username,
                            style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            role,
                            style: TextStyle(
                              color: AppTheme.textSecondary.withOpacity(0.5),
                              fontSize: 10,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.message, color: getTypeColor()),
                      onPressed: () {
                        Navigator.pushNamed(
                          context, 
                          '/dm', 
                          arguments: {'userId': data['userId'] ?? 1, 'name': username}
                        );
                      },
                    )
                  ],
                ),
                const SizedBox(height: 16),

                // Content
                Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  content,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 8),
                
                // Roadmap Steps
                if (type == 'ROADMAP' && data['steps'] != null && isExpanded)
                  Container(
                    margin: const EdgeInsets.only(top: 8, bottom: 8),
                    child: Column(
                      children: List.generate((data['steps'] as List).length, (index) {
                        final step = data['steps'][index];
                        final isOpen = openStepIndex == index;
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF12121A),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    openStepIndex = isOpen ? null : index;
                                  });
                                },
                                child: Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 24,
                                        height: 24,
                                        decoration: BoxDecoration(
                                          color: getTypeColor().withOpacity(0.2),
                                          shape: BoxShape.circle,
                                          border: Border.all(color: getTypeColor().withOpacity(0.5)),
                                        ),
                                        alignment: Alignment.center,
                                        child: Text('${index + 1}', style: TextStyle(color: getTypeColor(), fontSize: 12, fontWeight: FontWeight.bold)),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(step['title'] ?? 'Adım', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                      ),
                                      Icon(isOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: Colors.white54, size: 16),
                                    ],
                                  ),
                                ),
                              ),
                              if (isOpen)
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: const BoxDecoration(
                                    border: Border(top: BorderSide(color: Colors.white12)),
                                  ),
                                  child: Text(step['content'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                                ),
                            ],
                          ),
                        );
                      }),
                    ),
                  ),

                // Devamını Oku / İncele
                GestureDetector(
                  onTap: () {
                    if (type == 'PROJECT') {
                      Navigator.pushNamed(context, '/project_detail', arguments: data);
                    } else if (type == 'ROADMAP') {
                      setState(() {
                        isExpanded = !isExpanded;
                      });
                    }
                  },
                  child: Text(
                    type == 'ROADMAP' ? (isExpanded ? 'Gizle' : 'İncele') : 'Devamını Oku >',
                    style: TextStyle(
                      color: getTypeColor(),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Actions
                Divider(color: Colors.white.withOpacity(0.1)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        GestureDetector(
                          onTap: handleLike,
                          child: Row(
                            children: [
                              Icon(isLiked ? Icons.thumb_up : Icons.thumb_up_alt_outlined, color: getTypeColor(), size: 18),
                              const SizedBox(width: 4),
                              const Text('Beğen', style: TextStyle(color: Colors.white70, fontSize: 12)),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        const Icon(Icons.mode_comment_outlined, color: Colors.white70, size: 18),
                        const SizedBox(width: 4),
                        const Text('Yorum', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.share_outlined, color: Colors.white70, size: 18),
                      onPressed: handleShare,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
