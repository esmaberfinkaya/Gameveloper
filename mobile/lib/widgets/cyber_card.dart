import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CyberCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? glowColor;
  final bool hasGlow;
  final double borderWidth;
  final VoidCallback? onTap;

  const CyberCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16.0),
    this.glowColor,
    this.hasGlow = false,
    this.borderWidth = 1.0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final activeGlowColor = glowColor ?? Theme.of(context).primaryColor;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        decoration: BoxDecoration(
          color: AppTheme.cardBg,
          // Beveled edges logic can be approximated by complex borders or ClipPath.
          // For simplicity and performance, we'll use a standard slight rounded border with aggressive colors.
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: hasGlow ? activeGlowColor : activeGlowColor.withOpacity(0.3),
            width: borderWidth,
          ),
          boxShadow: hasGlow ? AppTheme.getGlow(activeGlowColor, spread: 1, blur: 10) : [],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(11),
          child: Stack(
            children: [
              // Subtle internal grid/line background
              Positioned.fill(
                child: Opacity(
                  opacity: 0.03,
                  child: Image.network(
                    'https://www.transparenttextures.com/patterns/cubes.png',
                    repeat: ImageRepeat.repeat,
                  ),
                ),
              ),
              Padding(
                padding: padding,
                child: child,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
