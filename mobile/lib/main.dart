import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/main_navigation.dart';

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
      home: const MainNavigation(),
    );
  }
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            padding: const EdgeInsets.all(32.0),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFBD93F9).withOpacity(0.3)),
              boxShadow: const [
                BoxShadow(
                  color: Color(0xFFBD93F9),
                  blurRadius: 20.0,
                  spreadRadius: -10,
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'GAMEVELOPER',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF00FFFF),
                    letterSpacing: 3.0,
                    shadows: [
                      Shadow(color: Color(0xFF00FFFF), blurRadius: 10),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                
                // Tabs
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => isLogin = true),
                        child: Container(
                          padding: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                color: isLogin ? const Color(0xFF00FFFF) : Colors.transparent,
                                width: 2,
                              ),
                            ),
                          ),
                          child: Text(
                            'GİRİŞ YAP',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: isLogin ? const Color(0xFF00FFFF) : Colors.grey,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => isLogin = false),
                        child: Container(
                          padding: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                color: !isLogin ? const Color(0xFFFF00FF) : Colors.transparent,
                                width: 2,
                              ),
                            ),
                          ),
                          child: Text(
                            'KAYIT OL',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: !isLogin ? const Color(0xFFFF00FF) : Colors.grey,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                if (!isLogin) ...[
                  _buildTextField(label: 'Kullanıcı Adı', hint: 'NeonHero_99'),
                  const SizedBox(height: 16),
                ],
                
                _buildTextField(label: 'E-posta', hint: 'dev@gameveloper.com'),
                const SizedBox(height: 16),
                _buildTextField(label: 'Şifre', hint: '••••••••', obscureText: true),
                const SizedBox(height: 32),

                // Submit Button
                ElevatedButton(
                  onPressed: () {
                    // Navigate to MainNavigation on successful connect
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const MainNavigation())
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isLogin ? const Color(0xFF00FFFF) : const Color(0xFFFF00FF),
                    foregroundColor: const Color(0xFF0D1117), // Dark text on glow background
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 10,
                    shadowColor: isLogin ? const Color(0xFF00FFFF) : const Color(0xFFFF00FF),
                  ),
                  child: Text(
                    isLogin ? 'BAĞLAN' : 'SİSTEME KATIL',
                    style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({required String label, required String hint, bool obscureText = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Color(0xFFBD93F9), fontSize: 12, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        TextField(
          obscureText: obscureText,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: const Color(0xFF161B22),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFFBD93F9)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF00FFFF), width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
