// global/states/auth_state.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:app/global/network/api_provider.dart';

part 'auth_state.g.dart';

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  bool build() => false;

  Future<void> init() async {
    final client = await ref.read(apiProvider.future);
    try {
      await client.get('/auth/refresh'); // TODO: confirmar rota real com o backend
      state = true;
    } catch (_) {
      state = false;
    }
  }

  Future<void> login(String email, String password) async {
    final client = await ref.read(apiProvider.future);
    await client.post('/auth/login', data: {'email': email, 'password': password});

    state = true;
  }

  Future<void> logout() async {
    state = false; // TODO: confirmar se existe rota de logout no backend pra invalidar/limpar o cookie server-side
  }
}