import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/evaluation_provider.dart';
import 'evaluation_wizard_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  // ============ BẢNG MÀU NUTRIHEALTH ============
  // Lấy trực tiếp từ logo: xanh dương sáng (trái tim y tế) + xanh lá tươi (con người)
  static const Color nhBlue = Color(0xFF2196F3);       // Xanh dương sáng - chủ đạo
  static const Color nhBlueDark = Color(0xFF1976D2);    // Xanh dương đậm hơn
  static const Color nhBlueLight = Color(0xFF42A5F5);   // Xanh dương nhạt
  static const Color nhGreen = Color(0xFF66BB6A);       // Xanh lá tươi - accent
  static const Color nhGreenDark = Color(0xFF43A047);   // Xanh lá đậm

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<EvaluationProvider>(context);
    final config = provider.appConfig;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF1E88E5),  // Xanh dương tươi sáng (top)
              Color(0xFF42A5F5),  // Xanh dương nhạt hơn (bottom)
            ],
          ),
        ),
        child: Stack(
          children: [
            // Decorative soft circles - tạo chiều sâu
            Positioned(
              top: -120,
              right: -80,
              child: Container(
                width: 400,
                height: 400,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.07),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Positioned(
              bottom: -100,
              left: -60,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            // Soft green accent circle (phản ánh xanh lá trong logo)
            Positioned(
              top: 60,
              left: -40,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  color: nhGreen.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo trong khung trắng bo tròn
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.12),
                          blurRadius: 40,
                          offset: const Offset(0, 12),
                        ),
                      ],
                    ),
                    child: Image.asset('assets/logo.png', height: 110,
                      errorBuilder: (_, __, ___) => const Icon(Icons.local_hospital_rounded, size: 80, color: nhBlue),
                    ),
                  ),
                  
                  const SizedBox(height: 36),
                  
                  Text(
                    config?.welcomeTitle ?? 'Đánh Giá Chất Lượng Dịch Vụ',
                    style: const TextStyle(
                      fontSize: 42,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 14),
                  
                  Text(
                    config?.welcomeSubtitle ?? 'Ý kiến của bạn giúp chúng tôi phục vụ tốt hơn',
                    style: TextStyle(
                      fontSize: 21,
                      color: Colors.white.withOpacity(0.9),
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  
                  const SizedBox(height: 50),
                  
                  // Nút BẮT ĐẦU
                  ElevatedButton(
                    onPressed: provider.isLoading 
                      ? null 
                      : () => Navigator.push(
                          context, 
                          MaterialPageRoute(builder: (_) => const EvaluationWizardScreen())
                        ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 56, vertical: 20),
                      backgroundColor: Colors.white,
                      foregroundColor: nhBlueDark,
                      elevation: 8,
                      shadowColor: Colors.black.withOpacity(0.2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(50),
                      ),
                    ),
                    child: provider.isLoading
                      ? const SizedBox(
                          width: 24, height: 24,
                          child: CircularProgressIndicator(strokeWidth: 3, color: nhBlue),
                        )
                      : const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'BẮT ĐẦU ĐÁNH GIÁ',
                              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(width: 12),
                            Icon(Icons.arrow_forward_rounded, size: 24),
                          ],
                        ),
                  ),
                ],
              ),
            ),
            
            // Footer Hotline
            Positioned(
              bottom: 30,
              left: 0,
              right: 0,
              child: Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.phone_rounded, color: Colors.white.withOpacity(0.6), size: 18),
                    const SizedBox(width: 8),
                    Text(
                      'Hotline hỗ trợ: ${config?.hotline ?? "1900 1234"}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.6),
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
