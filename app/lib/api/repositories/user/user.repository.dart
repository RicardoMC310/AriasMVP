import 'package:app/api/provider/api_provider.dart';
import 'package:app/global/models/api/api_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:dio/dio.dart';

part 'user.repository.g.dart';

class UserRepository {
  UserRepository(this._client);
  final Dio _client; 

  Future<ApiResponse<List<dynamic>>> register(String username, String email, String password) async {
    final res = await _client.post('/user/register', data: {
      username,
      email,
      password
    });

    return ApiResponse.fromJson(res.data, (d) => d);
  }
}

@riverpod 
Future<UserRepository> userRepository(Ref ref) async {
  final client = await ref.watch(apiProvider.future);
  return UserRepository(client);
}