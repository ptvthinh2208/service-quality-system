import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  // Mặc định là IP máy tính của bạn cho môi trường Dev
  // Khi build có thể ghi đè bằng lệnh: --dart-define=API_URL=http://your-server-ip:port/api
  static String baseUrl = const String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://192.168.1.122/api',
  );

  static Future<void> loadBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    final savedUrl = prefs.getString('API_URL');
    if (savedUrl != null && savedUrl.isNotEmpty) {
      baseUrl = savedUrl;
    }
  }

  static Future<void> saveBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('API_URL', url);
    baseUrl = url;
  }
  // Các cấu hình khác nếu có
  static const String appName = 'Nutrihealth Evaluation';
  static const String appVersion = '1.0.0';
}
