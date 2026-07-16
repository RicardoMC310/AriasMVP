import 'package:app/screens/landing/index.dart';
import 'package:go_router/go_router.dart';

final List<RouteBase> landingRoute = [
  GoRoute(
    path: '/', 
    builder: (context, state) => Landing()
  )
];