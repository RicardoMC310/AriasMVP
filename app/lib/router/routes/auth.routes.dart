import 'package:app/screens/auth/login/index.dart';
import 'package:app/screens/auth/register/index.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

final List<RouteBase> authRoutes = [
  GoRoute(
    path: '/login', 
    builder: (context, state) => Scaffold(
      appBar: AppBar(title: Text('Login')),
    )
  ),
  GoRoute(
    path: '/register', 
    builder: (context, state) => Scaffold(
      appBar: AppBar(title: Text('Register')),
    )
  )
];