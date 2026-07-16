import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:app/config/storage/token_storage.dart';

part 'auth_state.g.dart'; 

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  String? build() => null; 

  Future<void> init() async {
    state = await TokenStorage.read();
  }

  Future<void> login(String token) async {
    state = token;
    await TokenStorage.save(token);
  }

  Future<void> logout() async {
    state = null;
    await TokenStorage.delete();
  }
}