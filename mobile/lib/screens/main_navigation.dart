import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'explore_screen.dart';
import 'profile_screen.dart';
import 'issues_screen.dart';
import 'ideas_screen.dart';
import 'partnership_screen.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    ExploreScreen(),
    IdeasScreen(),
    const IssuesScreen(),
    PartnershipScreen(),
    ProfileScreen(),
  ];

  Color _getThemeColor(int index) {
    switch (index) {
      case 1:
        return AppTheme.neonYellow;
      case 2:
        return AppTheme.neonDeepBlue;
      case 3:
        return AppTheme.accentPurple;
      case 4:
        return AppTheme.neonDeepRed;
      case 0:
      default:
        return AppTheme.neonDeepBlue;
    }
  }

  @override
  Widget build(BuildContext context) {
    final accentColor = _getThemeColor(_currentIndex);
    final theme = Theme.of(context);
    final customTheme = theme.copyWith(
      primaryColor: accentColor,
      colorScheme: theme.colorScheme.copyWith(primary: accentColor),
      bottomNavigationBarTheme: theme.bottomNavigationBarTheme.copyWith(
        selectedItemColor: accentColor,
      ),
      iconTheme: theme.iconTheme.copyWith(color: accentColor),
    );

    return Theme(
      data: customTheme,
      child: Scaffold(
        body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: accentColor.withOpacity(0.1),
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
              icon: Icon(Icons.lightbulb_outline),
              activeIcon: Icon(Icons.lightbulb),
              label: 'Fikirler',
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
          type: BottomNavigationBarType.fixed,
        ),
      ),
    ));
  }
}

