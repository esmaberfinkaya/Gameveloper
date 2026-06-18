import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';
import 'main_navigation.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _error;
  late AnimationController _glitchController;

  @override
  void initState() {
    super.initState();
    _glitchController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _glitchController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin({String? overrideEmail, String? overridePassword}) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final email = overrideEmail ?? _emailController.text;
    final password = overridePassword ?? _passwordController.text;

    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:5000/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        await prefs.setString('user', json.encode(data['user']));

        if (!mounted) return;
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MainNavigation()),
        );
      } else {
        setState(() {
          _error = data['error'] ?? 'Giriş başarısız.';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Sunucuya bağlanılamadı. npx prisma db seed yaptınız mı?';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                colors: [Color(0xFF0D1117), Color(0xFF05070A)],
                center: Alignment.bottomCenter,
                radius: 1.5,
              ),
            ),
          ),
          
          // Glitch Lines
          AnimatedBuilder(
            animation: _glitchController,
            builder: (context, child) {
              return Stack(
                children: List.generate(10, (index) {
                  return Positioned(
                    top: (MediaQuery.of(context).size.height / 10) * index + (_glitchController.value * 20),
                    left: 0,
                    right: 0,
                    height: 1,
                    child: Container(
                      color: index % 2 == 0 
                          ? Theme.of(context).primaryColor.withOpacity(0.1) 
                          : Theme.of(context).primaryColor.withOpacity(0.1),
                    ),
                  );
                }),
              );
            },
          ),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Container(
                padding: const EdgeInsets.all(32.0),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg.withOpacity(0.9),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(color: Theme.of(context).primaryColor.withOpacity(0.1), blurRadius: 30, spreadRadius: -5),
                    BoxShadow(color: Theme.of(context).primaryColor.withOpacity(0.1), blurRadius: 30, spreadRadius: -5),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Title with Glitch Effect
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        Transform.translate(
                          offset: const Offset(-2, -2),
                          child: Text(
                            'GAMEVELOPER',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Theme.of(context).primaryColor.withOpacity(0.5),
                              letterSpacing: 4,
                            ),
                          ),
                        ),
                        Transform.translate(
                          offset: const Offset(2, 2),
                          child: Text(
                            'GAMEVELOPER',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Theme.of(context).primaryColor.withOpacity(0.5),
                              letterSpacing: 4,
                            ),
                          ),
                        ),
                        const Text(
                          'GAMEVELOPER',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: 4,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'SİSTEM ERİŞİMİ',
                      style: TextStyle(color: Colors.white54, fontSize: 10, letterSpacing: 6),
                    ),
                    const SizedBox(height: 48),

                    // Inputs
                    TextField(
                      controller: _emailController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: 'E-posta',
                        labelStyle: TextStyle(color: Theme.of(context).primaryColor),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Theme.of(context).primaryColor),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: Colors.black26,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _passwordController,
                      style: const TextStyle(color: Colors.white),
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Şifre',
                        labelStyle: TextStyle(color: Theme.of(context).primaryColor),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Theme.of(context).primaryColor),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: Colors.black26,
                      ),
                    ),
                    
                    if (_error != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor.withOpacity(0.1),
                          border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(_error!, style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 12)),
                      )
                    ],

                    const SizedBox(height: 32),

                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : () => _handleLogin(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          foregroundColor: Colors.black,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          elevation: 10,
                          shadowColor: Theme.of(context).primaryColor,
                        ),
                        child: _isLoading 
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
                            : const Text('BAĞLAN', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
                      ),
                    ),

                    const SizedBox(height: 32),
                    const Divider(color: Colors.white24),
                    const SizedBox(height: 16),
                    const Text('HIZLI TEST GİRİŞİ', style: TextStyle(color: Colors.white54, fontSize: 10, letterSpacing: 2)),
                    const SizedBox(height: 16),
                    
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => _handleLogin(overrideEmail: 'esma@gameveloper.com', overridePassword: '123456'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Theme.of(context).primaryColor,
                              side: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                              backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Column(
                              children: [
                                Text('Esma', style: TextStyle(fontWeight: FontWeight.bold)),
                                Text('(DEVELOPER)', style: TextStyle(fontSize: 8)),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => _handleLogin(overrideEmail: 'alphagamer@gameveloper.com', overridePassword: '123456'),

                            style: OutlinedButton.styleFrom(
                              foregroundColor: Theme.of(context).primaryColor,
                              side: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                              backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Column(
                              children: [
                                Text('AlphaGamer', style: TextStyle(fontWeight: FontWeight.bold)),
                                Text('(GAMER)', style: TextStyle(fontSize: 8)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
