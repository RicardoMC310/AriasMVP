import 'package:app/presentation/states/email-verification/email_verification_state.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class EmailVerificationModal extends ConsumerStatefulWidget {
  const EmailVerificationModal({super.key});

  @override
  ConsumerState<EmailVerificationModal> createState() => _EmailVerificationModalState();
}

class _EmailVerificationModalState extends ConsumerState<EmailVerificationModal> {
  final _codeController = TextEditingController();
  bool _verifying = false;
  bool _resending = false;

  Future<void> _handleVerify() async {
    setState(() => _verifying = true);
    try {
      final response = await ref.read(emailVerificationProvider.notifier).verify(_codeController.text);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(response.message)));
      Navigator.of(context).pop(); 
      context.go('/login');
    } on DioException catch (e) {
      final message = e.response?.data?['message'] as String? ?? 'Código inválido';
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    } finally {
      if (mounted) setState(() => _verifying = false);
    }
  }

  Future<void> _handleResend() async {
    setState(() => _resending = true);
    try {
      final response = await ref.read(emailVerificationProvider.notifier).resend();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(response.message)));
    } on DioException catch (e) {
      final message = e.response?.data?['message'] as String? ?? 'Erro ao reenviar';
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    } finally {
      if (mounted) setState(() => _resending = false);
    }
  }

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final data = ref.watch(emailVerificationProvider);
    final cooldown = data?.resendCooldown ?? 0;

    return PopScope(
      canPop: false, 
      child: AlertDialog(
        title: const Text('Verifique seu email'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Enviamos um código para ${data?.email ?? ""}.'),
            const SizedBox(height: 16),
            TextField(controller: _codeController, decoration: const InputDecoration(labelText: 'Código')),
          ],
        ),
        actions: [
          TextButton(
            onPressed: (_resending || cooldown > 0) ? null : _handleResend,
            child: Text(_resending ? 'Enviando...' : cooldown > 0 ? 'Reenviar em ${cooldown}s' : 'Reenviar código'),
          ),
          ElevatedButton(
            onPressed: _verifying ? null : _handleVerify,
            child: _verifying
                ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Verificar'),
          ),
        ],
      ),
    );
  }
}