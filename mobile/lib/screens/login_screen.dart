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
  final TextEditingController _nameController = TextEditingController();
  
  bool _isLogin = true;
  String _role = 'GAMER';
  bool _isLoading = false;
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
    _nameController.dispose();
    _glitchController.dispose();
    super.dispose();
  }

  void _showCyberSnackbar(String message, bool isError) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.warning_amber_rounded : Icons.check_circle_outline,
              color: isError ? Colors.redAccent : Colors.greenAccent,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  color: Colors.white,
                  fontFamily: 'monospace',
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: AppTheme.cardBg,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(
            color: isError ? Colors.redAccent : Colors.greenAccent,
            width: 2,
          ),
        ),
        elevation: 10,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  Future<void> _handleAuth({String? overrideEmail, String? overridePassword, bool isFastLogin = false}) async {
    final email = overrideEmail ?? _emailController.text.trim();
    final password = overridePassword ?? _passwordController.text;
    final name = _nameController.text.trim();

    if (email.isEmpty || password.isEmpty || (!_isLogin && !isFastLogin && name.isEmpty)) {
      _showCyberSnackbar('Tüm alanları doldurmanız gerekiyor.', true);
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final endpoint = (isFastLogin || _isLogin) ? '/api/auth/login' : '/api/auth/register';
    final payload = (isFastLogin || _isLogin)
        ? {'email': email, 'password': password}
        : {'email': email, 'password': password, 'name': name, 'role': _role};

    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:5000$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(payload),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (isFastLogin || _isLogin) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', data['token']);
          await prefs.setString('user', json.encode(data['user']));

          _showCyberSnackbar('Sisteme başarıyla bağlanıldı. Hoş geldin ${data['user']['name']}!', false);

          if (!mounted) return;
          Future.delayed(const Duration(milliseconds: 800), () {
            if (!mounted) return;
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const MainNavigation()),
            );
          });
        } else {
          _showCyberSnackbar('Ağa başarıyla katıldın! Lütfen giriş yap.', false);
          setState(() {
            _isLogin = true;
            _passwordController.clear();
          });
        }
      } else {
        _showCyberSnackbar(data['error'] ?? 'İşlem başarısız.', true);
      }
    } catch (e) {
      _showCyberSnackbar('Sunucuya bağlanılamadı. Backend aktif mi?', true);
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
    final themeColor = _isLogin ? Theme.of(context).primaryColor : Colors.pinkAccent;

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
                          : Colors.pinkAccent.withOpacity(0.1),
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
                  border: Border.all(color: themeColor.withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(color: themeColor.withOpacity(0.1), blurRadius: 30, spreadRadius: -5),
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
                              color: Colors.pinkAccent.withOpacity(0.5),
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
                    const SizedBox(height: 32),

                    // Tabs (GİRİŞ YAP / KAYIT OL)
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _isLogin = true),
                            child: Container(
                              padding: const EdgeInsets.only(bottom: 8),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: _isLogin ? Theme.of(context).primaryColor : Colors.transparent,
                                    width: 2,
                                  ),
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'GİRİŞ YAP',
                                  style: TextStyle(
                                    color: _isLogin ? Theme.of(context).primaryColor : Colors.white54,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.5,
                                    shadows: _isLogin ? [Shadow(color: Theme.of(context).primaryColor, blurRadius: 10)] : null,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _isLogin = false),
                            child: Container(
                              padding: const EdgeInsets.only(bottom: 8),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: !_isLogin ? Colors.pinkAccent : Colors.transparent,
                                    width: 2,
                                  ),
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'KAYIT OL',
                                  style: TextStyle(
                                    color: !_isLogin ? Colors.pinkAccent : Colors.white54,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.5,
                                    shadows: !_isLogin ? [const Shadow(color: Colors.pinkAccent, blurRadius: 10)] : null,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Inputs
                    if (!_isLogin) ...[
                      TextField(
                        controller: _nameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: 'Kullanıcı Adı',
                          labelStyle: TextStyle(color: themeColor),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: themeColor.withOpacity(0.5)),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: themeColor),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          filled: true,
                          fillColor: Colors.black26,
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    TextField(
                      controller: _emailController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: 'E-posta',
                        labelStyle: TextStyle(color: themeColor),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: themeColor.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: themeColor),
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
                        labelStyle: TextStyle(color: themeColor),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: themeColor.withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: themeColor),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: Colors.black26,
                      ),
                    ),

                    if (!_isLogin) ...[
                      const SizedBox(height: 24),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Rol Seçimi',
                          style: TextStyle(color: themeColor, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: RadioListTile<String>(
                              title: const Text('Gamer', style: TextStyle(color: Colors.white, fontSize: 12)),
                              value: 'GAMER',
                              groupValue: _role,
                              activeColor: Theme.of(context).primaryColor,
                              contentPadding: EdgeInsets.zero,
                              onChanged: (val) => setState(() => _role = val!),
                            ),
                          ),
                          Expanded(
                            child: RadioListTile<String>(
                              title: const Text('Developer', style: TextStyle(color: Colors.white, fontSize: 12)),
                              value: 'DEVELOPER',
                              groupValue: _role,
                              activeColor: Colors.pinkAccent,
                              contentPadding: EdgeInsets.zero,
                              onChanged: (val) => setState(() => _role = val!),
                            ),
                          ),
                        ],
                      ),
                    ],

                    const SizedBox(height: 32),

                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : () => _handleAuth(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: themeColor,
                          foregroundColor: Colors.black,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          elevation: 10,
                          shadowColor: themeColor,
                        ),
                        child: _isLoading 
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
                            : Text(_isLogin ? 'SİSTEME BAĞLAN' : 'AĞA KATIL', style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
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
                            onPressed: () => _handleAuth(overrideEmail: 'esma@gameveloper.com', overridePassword: '123456', isFastLogin: true),
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
                            onPressed: () => _handleAuth(overrideEmail: 'alphagamer@gameveloper.com', overridePassword: '123456', isFastLogin: true),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.pinkAccent,
                              side: BorderSide(color: Colors.pinkAccent.withOpacity(0.5)),
                              backgroundColor: Colors.pinkAccent.withOpacity(0.1),
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
