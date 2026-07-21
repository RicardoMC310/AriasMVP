import 'package:app/api/provider/api_provider.dart';
import 'package:app/global/models/api/api_response.dart';
import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth.repository.g.dart';

class AuthRepository {
  AuthRepository(this._client);
  final Dio _client;

  Future<ApiResponse<List<dynamic>>> login(String email, String password) async {
    final res = await _client.post('/auth/login', data: {
      email,
      password
    });

    return ApiResponse.fromJson(res.data, (d) => d);
  }

  Future<bool> refresh() async {
    try {
      await _client.get('/auth/refresh'); // TODO: confirm session verification endpoint
      return true;
    } on DioException {
      return false;
    }
  }

  Future<void> logout() async {}
}

@riverpod
Future<AuthRepository> authRepository(Ref ref) async {
  final client = await ref.watch(apiProvider.future);
  return AuthRepository(client);
}