import 'dart:async';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:app/api/repositories/email-verification/email_verification.repository.dart';
import 'package:app/global/models/api/api_response.dart';

part 'email_verification_state.g.dart';

class EmailVerificationData {
  EmailVerificationData({required this.email, this.resendCooldown = 0});
  final String email;
  final int resendCooldown;
}

@riverpod
class EmailVerificationNotifier extends _$EmailVerificationNotifier {
  Timer? _cooldownTimer;

  @override
  EmailVerificationData? build() {
    ref.onDispose(() => _cooldownTimer?.cancel());
    return null;
  }

  void setEmail(String email) {
    state = EmailVerificationData(email: email);
  }

  Future<ApiResponse<List<dynamic>>> resend() async {
    final repo = await ref.read(emailVerificationRepositoryProvider.future);
    final response = await repo.resend(state!.email);
    _startCooldown();
    return response;
  }

  Future<ApiResponse<List<dynamic>>> verify(String code) async {
    final repo = await ref.read(emailVerificationRepositoryProvider.future);
    return repo.verify(state!.email, code);
  }

  void _startCooldown() {
    _cooldownTimer?.cancel();
    state = EmailVerificationData(email: state!.email, resendCooldown: 30);
    _cooldownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final current = state!.resendCooldown;
      if (current <= 1) {
        timer.cancel();
        state = EmailVerificationData(email: state!.email, resendCooldown: 0);
      } else {
        state = EmailVerificationData(email: state!.email, resendCooldown: current - 1);
      }
    });
  }
}