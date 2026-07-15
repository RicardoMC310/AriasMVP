type HttpResponse = {
    message: string;
    statusCode: number;
    data: Object
};

export default function createHttpResponse(message: string = "ok", statusCode: number = 200, data: Object = []): HttpResponse {
    return {
        message,
        statusCode,
        data
    }
}