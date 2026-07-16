import 'package:go_router/go_router.dart';
import 'routes/auth.routes.dart';
import 'routes/dashboard.routes.dart';
import 'routes/landing.route.dart';

final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: [
    ...authRoutes,  
    ...dashboardRoutes,
    ...landingRoute
  ]
);