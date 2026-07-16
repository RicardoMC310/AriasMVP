import 'package:app/api/repositories/auth.repository.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final authRepository = AuthRepository();

  final TextEditingController nameController = TextEditingController(); 
  final TextEditingController emailController = TextEditingController(); 
  final TextEditingController passwordController = TextEditingController(); 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Register')),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              key: Key('name'),
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'Name'
              ),
            ),
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
            ElevatedButton(onPressed: authRepository.call, child: Text('Register')),
            SizedBox(height: 10),
            ElevatedButton(onPressed: () => context.go('/login'), child: Text("Already have an account? Login")),
          ],
        ),
      )
    );
  }
}