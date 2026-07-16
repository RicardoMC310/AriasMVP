import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:app/global/states/auth_state.dart';
import 'routes/auth.routes.dart';
import 'routes/dashboard.routes.dart';
import 'routes/landing.route.dart';
import 'refresh_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    refreshListenable: RouterRefreshNotifier(ref),
    routes: [
      ...authRoutes,  
      ...dashboardRoutes,
      ...landingRoute
    ],
    redirect: (context, state) {
      final token = ref.read(authProvider);
      final loggedIn = token != null;
      final goingToLogin = state.matchedLocation == '/login';

      if (!loggedIn && !goingToLogin) return '/login';
      if (loggedIn && goingToLogin) return '/dashboard';
      return null;
    },
  );
});