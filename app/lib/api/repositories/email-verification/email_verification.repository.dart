import 'package:app/api/provider/api_provider.dart';
import 'package:app/global/models/api/api_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:dio/dio.dart';

part 'email_verification.repository.g.dart';

class EmailVerificationRepository {
  EmailVerificationRepository(this._client);
  final Dio _client; 

  Future<ApiResponse<List<dynamic>>> resend(String email) async {
    final res = await _client.post('/email-verification/resend', data: { email });

    return ApiResponse.fromJson(res.data, (d) => d);
  }

  Future<ApiResponse<List<dynamic>>> verify(String email, String token) async {
    final res = await _client.post('/email-verification/verify', data: {
      email,
      token
    });

    return ApiResponse.fromJson(res.data, (d) => d);
  }
}

@riverpod 
Future<EmailVerificationRepository> emailVerificationRepository(Ref ref) async {
  final client = await ref.watch(apiProvider.future);
  return EmailVerificationRepository(client);
}
