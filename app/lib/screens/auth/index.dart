import 'package:app/api/repositories/auth/auth.repository.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _authRepository = AuthRepository();

  final TextEditingController emailController = TextEditingController(); 
  final TextEditingController passwordController = TextEditingController(); 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              key: Key('email'),
              controller: emailController,
              decoration: InputDecoration(
                labelText: 'E-mail'
              ),
            ),
            TextField(
              key: Key('password'),
              controller: passwordController,
              decoration: InputDecoration(
                labelText: 'Password'
              ),
            ),
            SizedBox(height: 10),
            ElevatedButton(onPressed: () => _authRepository, child: Text('Login')),
            SizedBox(height: 10),
            ElevatedButton(onPressed: () => context.go('/register'), child: Text("Don't have an account? Register")),
          ],
        ),
      )
    );
  }
}