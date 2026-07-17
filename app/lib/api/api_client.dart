import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/browser.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

class ApiClient {
  

  static Future<Dio> create() async {
    final defaultBaseUrl = String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'https://localhost:8000',
    );

    final httpAdapter = BrowserHttpClientAdapter();
    httpAdapter.withCredentials = true;

    final appDocDir = await getApplicationDocumentsDirectory();
    final cookieJar = PersistCookieJar(
      storage: FileStorage('${appDocDir.path}/.cookies/')
    );

    final Dio client = Dio(
      BaseOptions(
        baseUrl: defaultBaseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    client.httpClientAdapter = httpAdapter;

    client.interceptors.add(CookieManager(cookieJar));

    return client;
  }
}