import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Register')),
      body: Column(
        children: [
          ElevatedButton(onPressed: () => context.go('/login'), child: Text('Already have an account? Login')),
        ],
      ),
    );
  }
}