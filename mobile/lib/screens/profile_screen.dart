import 'package:flutter/material.dart';
import '../widgets/cyber_card.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  final String username;
  final String role;
  final int trustScore;
  final int solvedIssues;
  final int completedProjects;
  
  const ProfileScreen({
    super.key,
    this.username = 'ESMA',
    this.role = 'DEVELOPER',
    this.trustScore = 1250,
    this.solvedIssues = 15,
    this.completedProjects = 4,
  });

  @override
  Widget build(BuildContext context) {
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
                style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 4),
              ),
              centerTitle: true,
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: const BoxDecoration(
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
                          border: Border.all(color: AppTheme.accentPurple, width: 3),
                          boxShadow: AppTheme.getGlow(AppTheme.accentPurple, blur: 20),
                          color: AppTheme.background,
                        ),
                        child: Center(
                          child: Text(
                            username[0].toUpperCase(),
                            style: const TextStyle(
                              fontSize: 40,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.accentPurple,
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
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.neonCyan.withOpacity(0.1),
                          border: Border.all(color: AppTheme.neonCyan.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          role.toUpperCase(),
                          style: const TextStyle(
                            color: AppTheme.neonCyan,
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
              IconButton(icon: const Icon(Icons.settings), onPressed: () {}),
            ],
          ),
          
          // Bento Grid using SliverGrid
          SliverPadding(
            padding: const EdgeInsets.all(16.0),
            sliver: SliverGrid.count(
              crossAxisCount: 2,
              mainAxisSpacing: 16.0,
              crossAxisSpacing: 16.0,
              children: [
                // Trust Score Box
                CyberCard(
                  glowColor: AppTheme.neonCyan,
                  hasGlow: true,
                  borderWidth: 2,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.bolt, color: AppTheme.neonCyan, size: 36),
                      const SizedBox(height: 8),
                      const Text(
                        'TRUST SCORE',
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 10,
                          letterSpacing: 1.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        trustScore.toString(),
                        style: TextStyle(
                          color: AppTheme.neonCyan,
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          shadows: AppTheme.getGlow(AppTheme.neonCyan, spread: 0, blur: 10),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Secondary Stats Grid inside a card
                CyberCard(
                  glowColor: AppTheme.accentPurple,
                  hasGlow: false,
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: [
                      Expanded(
                        child: Container(
                          decoration: const BoxDecoration(
                            border: Border(bottom: BorderSide(color: Colors.white10)),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(solvedIssues.toString(), style: const TextStyle(color: AppTheme.textPrimary, fontSize: 24, fontWeight: FontWeight.bold)),
                                const Text('Çözülen Sorun', style: TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
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
                              Text(completedProjects.toString(), style: const TextStyle(color: AppTheme.neonYellow, fontSize: 24, fontWeight: FontWeight.bold)),
                              const Text('Tamamlanan Proje', style: TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
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
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: CyberCard(
                glowColor: AppTheme.neonPink,
                hasGlow: true,
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.neonPink.withOpacity(0.1),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.neonPink),
                      ),
                      child: const Icon(Icons.emoji_events, color: AppTheme.neonPink),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
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
              child: const Text(
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

          // Placeholder for empty feed list
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
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
                      const SizedBox(height: 16),
                      const Text('Henüz hiçbir içerik paylaşılmadı.', style: TextStyle(color: Colors.white54)),
                    ],
                  ),
                ),
              ),
            ),
          ),
          
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}
