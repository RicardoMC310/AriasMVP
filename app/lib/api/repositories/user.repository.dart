import 'package:app/api/api_client.dart';
import 'package:dio/dio.dart';

class UserRepository {
  Future<void> register(String username, String email, String password) async {
    final Dio client = await ApiClient.create();

    
  }
}