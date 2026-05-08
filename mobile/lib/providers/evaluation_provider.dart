import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class EvaluationProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  AppConfigModel? _appConfig;
  List<Category> _categories = [];
  bool _isLoading = false;

  // Evaluation results
  final Map<int, int> _ratings = {}; // CategoryId -> Score
  final Map<int, String> _comments = {}; // CategoryId -> Comment
  String _generalComment = '';

  AppConfigModel? get appConfig => _appConfig;
  List<Category> get categories => _categories;
  bool get isLoading => _isLoading;
  Map<int, int> get ratings => _ratings;
  Map<int, String> get comments => _comments;
  String get generalComment => _generalComment;

  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    _appConfig = await _apiService.getAppConfig();
    _categories = await _apiService.getCategories();

    _isLoading = false;
    notifyListeners();
  }

  void setRating(int categoryId, int score) {
    _ratings[categoryId] = score;
    notifyListeners();
  }

  void setComment(int categoryId, String comment) {
    _comments[categoryId] = comment;
    notifyListeners();
  }

  void setGeneralComment(String comment) {
    _generalComment = comment;
    notifyListeners();
  }

  void reset() {
    _ratings.clear();
    _comments.clear();
    _generalComment = '';
    notifyListeners();
  }

  Future<bool> submit() async {
    if (_categories.isEmpty) return false;

    final items = _ratings.entries.map((e) {
      return {
        'categoryId': e.key,
        'score': e.value,
        'comment': _comments[e.key] ?? '',
      };
    }).toList();

    final payload = {
      'deviceId': 'LDPlayer-Emulator', // Placeholder
      'devicePlatform': 'Android-Tablet',
      'appVersion': '1.0.0',
      'generalComment': _generalComment,
      'items': items,
    };

    final success = await _apiService.submitEvaluation(payload);
    if (success) {
      reset();
    }
    return success;
  }
}
