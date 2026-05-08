class AppConfig {
  // Mặc định là IP máy tính của bạn cho môi trường Dev
  // Khi build có thể ghi đè bằng lệnh: --dart-define=API_URL=http://your-server-ip:port/api
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://192.168.1.122:5170/api',
  );

  // Các cấu hình khác nếu có
  static const String appName = 'Nutrihealth Evaluation';
  static const String appVersion = '1.0.0';
}
