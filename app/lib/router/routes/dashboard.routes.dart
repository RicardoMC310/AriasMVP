import 'package:app/screens/dashboard/index.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final List<RouteBase> dashboardRoutes = [
  GoRoute(
    path: '/dashboard', 
    builder: (context, state) => Scaffold(
      appBar: AppBar(title: Text('Dashboard')),
    )
  )
];