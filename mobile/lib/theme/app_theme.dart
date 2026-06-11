import 'package:flutter/material.dart';

class AppTheme {
  // Core Colors
  static const Color background = Color(0xFF0D1117);
  static const Color cardBg = Color(0xFF161B22);
  static const Color neonCyan = Color(0xFF00FFFF);
  static const Color neonPink = Color(0xFFFF00FF);
  static const Color accentPurple = Color(0xFFBC13FE);
  static const Color neonGreen = Color(0xFF39FF14);
  static const Color neonYellow = Color(0xFFFFE300);
  static const Color neonDeepBlue = Color(0xFF0088FF);
  static const Color neonDeepRed = Color(0xFFFF003C);

  // Text Colors
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Colors.white70;

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: neonCyan,
      colorScheme: const ColorScheme.dark(
        primary: neonCyan,
        secondary: neonPink,
        surface: cardBg,
        background: background,
      ),
      fontFamily: 'Inter', // Assuming Inter or similar modern font
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w900),
        displayMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.bold),
        bodyLarge: TextStyle(color: textPrimary),
        bodyMedium: TextStyle(color: textSecondary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: neonCyan),
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w900,
          letterSpacing: 2.0,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardBg,
        selectedItemColor: neonCyan,
        unselectedItemColor: Colors.white30,
        type: BottomNavigationBarType.fixed,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
        unselectedLabelStyle: TextStyle(fontWeight: FontWeight.normal, fontSize: 10),
      ),
    );
  }

  // Shadow Definitions for Neon Glow
  static List<BoxShadow> getGlow(Color color, {double spread = 2.0, double blur = 15.0}) {
    return [
      BoxShadow(
        color: color.withOpacity(0.4),
        blurRadius: blur,
        spreadRadius: spread,
      ),
      BoxShadow(
        color: color.withOpacity(0.1),
        blurRadius: blur * 2,
        spreadRadius: spread * 2,
      ),
    ];
  }
}
