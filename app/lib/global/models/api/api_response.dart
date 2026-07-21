class ApiResponse<T> {
  ApiResponse({
    required this.message,
    required this.statusCode,
    required this.data,
  });

  final String message;
  final int statusCode;
  final T data;

  factory ApiResponse.fromJson(Map<String, dynamic> payload, T Function(dynamic) parseData) {
    return ApiResponse(
      message: payload['message'], 
      statusCode: payload['statusCode'], 
      data: parseData(payload['data'])
    );
  }
}