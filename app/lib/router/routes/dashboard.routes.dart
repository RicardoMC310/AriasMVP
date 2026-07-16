import 'package:app/screens/dashboard/index.dart';
import 'package:go_router/go_router.dart';

final List<RouteBase> dashboardRoutes = [
  GoRoute(
    path: '/dashboard', 
    builder: (context, state) => DashboardScreen()
  )
];