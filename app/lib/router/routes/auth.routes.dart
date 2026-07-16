import 'package:app/screens/auth/register/index.dart';
import 'package:app/screens/auth/login/index.dart';
import 'package:go_router/go_router.dart';

final List<RouteBase> authRoutes = [
  GoRoute(
    path: '/login', 
    builder: (context, state) => LoginScreen()
  ),
  GoRoute(
    path: '/register', 
    builder: (context, state) => RegisterScreen()
  )
];