import type { ServerResponse } from 'http';

export function sendSuccess(
    res: ServerResponse,
    statusCode: number,
    data: unknown
): void {
    res.writeHead(statusCode);

    res.end(JSON.stringify({
        success: true,
        data
    }));
}

export function sendError(
    res: ServerResponse,
    statusCode: number,
    message: string
): void {
    res.writeHead(statusCode);

    res.end(JSON.stringify({
        success: false,
        error: message
    }));
}