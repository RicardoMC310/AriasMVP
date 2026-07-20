type HttpResponse = {
    message: string;
    statusCode: number;
    data: Object,
    code: string;
    meta: Object;
};

export default function createHttpResponse(message: string = "OK", code: string = "OK", statusCode: number = 200, data: Object = [], meta: Object = []): HttpResponse {
    return {
        message,
        code,
        data,
        meta,
        statusCode
    }
}