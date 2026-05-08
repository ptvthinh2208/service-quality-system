class AppConfigModel {
  final String welcomeTitle;
  final String welcomeSubtitle;
  final String thankYouMessage;
  final int resetTimeoutSeconds;
  final String? logoUrl;
  final String primaryColor;
  final String hotline;

  AppConfigModel({
    required this.welcomeTitle,
    required this.welcomeSubtitle,
    required this.thankYouMessage,
    required this.resetTimeoutSeconds,
    this.logoUrl,
    required this.primaryColor,
    required this.hotline,
  });

  factory AppConfigModel.fromJson(Map<String, dynamic> json) {
    return AppConfigModel(
      welcomeTitle: json['welcomeTitle'] ?? 'Đánh Giá Chất Lượng Dịch Vụ',
      welcomeSubtitle: json['welcomeSubtitle'] ?? 'Hãy chia sẻ trải nghiệm của bạn',
      thankYouMessage: json['thankYouMessage'] ?? 'Cảm ơn bạn đã đánh giá!',
      resetTimeoutSeconds: json['resetTimeoutSeconds'] ?? 10,
      logoUrl: json['logoUrl'],
      primaryColor: json['primaryColor'] ?? '#6366F1',
      hotline: json['hotline'] ?? '1900 1234',
    );
  }
}

class Category {
  final int id;
  final String name;
  final String? description;
  final String? icon;
  final int displayOrder;

  Category({
    required this.id,
    required this.name,
    this.description,
    this.icon,
    required this.displayOrder,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      icon: json['icon'],
      displayOrder: json['displayOrder'] ?? 0,
    );
  }
}
