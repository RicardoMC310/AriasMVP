// config/network/dio_provider.dart
import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:app/api/api_client.dart';

part 'api_provider.g.dart';

@riverpod
Future<Dio> api(Ref ref) => ApiClient.create();