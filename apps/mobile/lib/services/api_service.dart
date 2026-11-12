import 'dart:convert';
import 'package:http/http.dart' as http;

class HighStudyApiService {
  static const String baseUrl = 'https://api.highstudy.edu/api';

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to authenticate');
  }

  static Future<Map<String, dynamic>> fetchStudentProfile(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/students/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to load profile');
  }
}
