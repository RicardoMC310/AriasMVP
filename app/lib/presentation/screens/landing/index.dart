import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Welcome! Try connecting or creating an account')),
      body: Column(
        children: [
          ElevatedButton(onPressed: () => context.push('/login'), child: Text('Login')),
          ElevatedButton(onPressed: () => context.push('/register'), child: Text('Register')),
        ],
      ),
    );
  }
}