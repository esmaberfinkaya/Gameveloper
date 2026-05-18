import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'explore_screen.dart';
import 'profile_screen.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const ExploreScreen(),
    const Center(child: Text('Sorunlar', style: TextStyle(color: Colors.white))),
    const Center(child: Text('Ortaklık Bul', style: TextStyle(color: Colors.white))),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: AppTheme.neonCyan.withOpacity(0.1),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.explore_outlined),
              activeIcon: Icon(Icons.explore),
              label: 'Keşfet',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.bug_report_outlined),
              activeIcon: Icon(Icons.bug_report),
              label: 'Sorunlar',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.group_add_outlined),
              activeIcon: Icon(Icons.group_add),
              label: 'Ortaklık',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
