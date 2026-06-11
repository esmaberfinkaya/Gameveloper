import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/main_navigation.dart';
import 'screens/login_screen.dart';

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
    );
  }
}


