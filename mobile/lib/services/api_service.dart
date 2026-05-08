import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';
import '../config/app_config.dart';

class ApiService {
  static const String baseUrl = AppConfig.baseUrl; 

  Future<AppConfigModel?> getAppConfig() async {
    try {
      print('Calling API: $baseUrl/app-config');
      final response = await http.get(Uri.parse('$baseUrl/app-config')).timeout(const Duration(seconds: 5));
      print('Response Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AppConfigModel.fromJson(data['data']);
        }
      }
    } catch (e) {
      print('Error fetching app config: $e');
    }
    return null;
  }

  Future<List<Category>> getCategories() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/categories'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final List list = data['data'];
          return list.map((item) => Category.fromJson(item)).toList();
        }
      }
    } catch (e) {
      print('Error fetching categories: $e');
    }
    return [];
  }

  Future<bool> submitEvaluation(Map<String, dynamic> evaluationData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/evaluations'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(evaluationData),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      }
    } catch (e) {
      print('Error submitting evaluation: $e');
    }
    return false;
  }
}
