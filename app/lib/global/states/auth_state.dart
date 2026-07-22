import 'package:app/api/repositories/auth/auth.repository.dart';
import 'package:app/global/models/api/api_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_state.g.dart';

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  bool build() => false;

  Future<void> init() async {
    final repository = await ref.read(authRepositoryProvider.future);
    state = await repository.checkSession(); 
  }

  Future<ApiResponse<List<dynamic>>> login(String email, String password) async {
    final repository = await ref.read(authRepositoryProvider.future);
    final res = await repository.login(email, password);

    state = true;

    return res;
  }

  Future<void> logout() async {
    final repository = await ref.read(authRepositoryProvider.future);
    await repository.logout(); // TODO: verify future fix in AuthRepository

    state = false;  
  }
}