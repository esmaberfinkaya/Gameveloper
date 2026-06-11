import 'package:flutter/material.dart';
import 'cyber_card.dart';
import '../theme/app_theme.dart';

class FeedCard extends StatelessWidget {
  final Map<String, dynamic> data;

  const FeedCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final type = data['type'] ?? 'UNKNOWN';
    final title = data['title'] ?? '';
    final content = data['content'] ?? '';
    final imageUrl = data['imageUrl'];
    final username = data['username'] ?? 'Anonim';
    final role = data['role'] ?? 'DEVELOPER';

    Color getTypeColor() {
      switch (type) {
        case 'PROJECT':
          return AppTheme.neonYellow;
        case 'ROADMAP':
          return AppTheme.neonGreen;
        case 'SOLUTION':
          return Theme.of(context).primaryColor;
        case 'QUESTION':
          return AppTheme.neonPink;
        default:
          return AppTheme.accentPurple;
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
                    Column(
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
                
                // Devamını Oku
                GestureDetector(
                  onTap: () {
                    // Navigate to details
                  },
                  child: Text(
                    'Devamını Oku >',
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
                        Icon(Icons.thumb_up_alt_outlined, color: getTypeColor(), size: 18),
                        const SizedBox(width: 4),
                        const Text('Beğen', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(width: 16),
                        const Icon(Icons.mode_comment_outlined, color: Colors.white70, size: 18),
                        const SizedBox(width: 4),
                        const Text('Yorum', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      ],
                    ),
                    const Icon(Icons.share_outlined, color: Colors.white70, size: 18),
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
