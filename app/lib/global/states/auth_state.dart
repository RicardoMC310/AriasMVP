import 'package:app/api/repositories/auth/auth.repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:app/api/provider/api_provider.dart';

part 'auth_state.g.dart';

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  bool build() => false;

  Future<void> init() async {
    final repository = await ref.read(authRepositoryProvider.future);
    state = await repository.refresh(); // TODO: confirm session verification endpoint
  }

  Future<void> login(String email, String password) async {
    final client = await ref.read(apiProvider.future);
    await client.post('/auth/login', data: {'email': email, 'password': password});

    state = true;
  }

  Future<void> logout() async {
    final repository = await ref.read(authRepositoryProvider.future);
    await repository.logout(); // TODO: confirm logout endpoint in backend
    state = false;  
  }
}