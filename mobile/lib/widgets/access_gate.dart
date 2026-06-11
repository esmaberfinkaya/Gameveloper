import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../theme/app_theme.dart';

class AccessGate extends StatefulWidget {
  final List<String> allowedRoles;
  final Widget child;

  const AccessGate({super.key, required this.allowedRoles, required this.child});

  @override
  State<AccessGate> createState() => _AccessGateState();
}

class _AccessGateState extends State<AccessGate> with SingleTickerProviderStateMixin {
  String? _userRole;
  bool _isLoading = true;
  late AnimationController _glitchController;

  @override
  void initState() {
    super.initState();
    _loadUserRole();
    _glitchController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _glitchController.dispose();
    super.dispose();
  }

  Future<void> _loadUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      final userObj = json.decode(userStr);
      setState(() {
        _userRole = userObj['role'];
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Center(child: CircularProgressIndicator(color: Theme.of(context).primaryColor));
    }

    if (_userRole != null && widget.allowedRoles.contains(_userRole)) {
      return widget.child;
    }

    // Access Denied UI
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor.withOpacity(0.1),
        border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.5)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedBuilder(
            animation: _glitchController,
            builder: (context, child) {
              return Transform.translate(
                offset: Offset(_glitchController.value * 4 - 2, 0),
                child: Icon(
                  Icons.block,
                  color: Theme.of(context).primaryColor,
                  size: 48,
                  shadows: [
                    Shadow(color: Theme.of(context).primaryColor, blurRadius: 15),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Text(
            'ACCESS DENIED',
            style: TextStyle(
              color: Theme.of(context).primaryColor,
              fontSize: 24,
              fontWeight: FontWeight.w900,
              letterSpacing: 4,
              shadows: [Shadow(color: Theme.of(context).primaryColor, blurRadius: 10)],
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.3)),
            ),
            child: Text(
              'DEVELOPER ROLE REQUIRED',
              style: TextStyle(
                color: Theme.of(context).primaryColor,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
