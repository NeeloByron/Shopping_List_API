import type { ServerResponse } from 'http';

// helper function to reply to a request this one sends "It worked" success
export function sendSuccess(
    res: ServerResponse,  // the reply being sent 
    statusCode: number, // number like 200 for success or 404 for not found
    data: unknown
): void {
    res.writeHead(statusCode); // sets that status
    res.end(JSON.stringify({  // JSON.stringify - turning the object into JSON text. & res.end(...) sends that text and finishes the reply 
        success: true,
        data
    }));
}

// helper function to reply to a request this one sends "Something went wrong!" Error
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