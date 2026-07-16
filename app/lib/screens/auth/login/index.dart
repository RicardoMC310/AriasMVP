import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Column(
        children: [
          ElevatedButton(onPressed: () => context.go('/register'), child: Text("Don't have an account? Register")),
        ],
      ),
    );
  }
}