import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:app/global/states/auth_state.dart';
import 'routes/auth.routes.dart';
import 'routes/dashboard.routes.dart';
import 'routes/landing.route.dart';
import 'refresh_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: RouterRefreshNotifier(ref),
    routes: [
      ...authRoutes,  
      ...dashboardRoutes,
      ...landingRoute
    ],
    redirect: (context, state) {
      final loggedIn = ref.read(authProvider);
      final goingToLogin = state.matchedLocation == '/login';
      final goingToRegister = state.matchedLocation == '/register';

      if (!loggedIn && !(goingToLogin || goingToRegister)) return '/'; // Are you going to Arias without identify yourself?? I don't think so! 
      if (loggedIn && (goingToLogin || goingToRegister)) return '/dashboard'; // Well, you have identified yourself. So you don't need to do it again. Get out!  

      return null; // Are you f**king kidding me?! CALL YOUR DEV RIGHT NOW, you have did a lot of sh*t. 
    }
  );
});