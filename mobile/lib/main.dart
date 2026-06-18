import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/main_navigation.dart';
import 'screens/login_screen.dart';
import 'screens/dm_screen.dart';
import 'screens/project_detail_screen.dart';

void main() {
  runApp(const GameveloperApp());
}

class GameveloperApp extends StatelessWidget {
  const GameveloperApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gameveloper',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const LoginScreen(),
      onGenerateRoute: (settings) {
        if (settings.name == '/dm') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => DMScreen(
              targetUserId: args['userId'],
              targetUserName: args['name'],
            ),
          );
        }
        if (settings.name == '/project_detail') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => ProjectDetailScreen(project: args),
          );
        }
        return null;
      },
    );
  }
}


