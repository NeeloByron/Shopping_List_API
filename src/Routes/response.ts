import type { IncomingMessage, ServerResponse } from 'http';

import {
    sendSuccess,
    sendError
} from '../controllers/errors';

import {
    getAllItems,
    addItem,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/itemController';

export async function requestHandler(
    req: IncomingMessage,
    res: ServerResponse
): Promise<void> {

    res.setHeader('Content-Type', 'application/json');

    const method = req.method;
    const url = req.url || '';

    // GET /items
    if (method === 'GET' && url === '/items') {

        sendSuccess(
            res,
            200,
            getAllItems()
        );

        return;
    }

    // GET /items/:id
    if (method === 'GET' && url.startsWith('/items/')) {

        const id = url.split('/')[2];

        if (!id) {
            sendError(
                res,
                400,
                'Item ID is required'
            );

            return;
        }

        const item = getItemById(id);

        if (!item) {
            sendError(
                res,
                404,
                'Item not found'
            );

            return;
        }

        sendSuccess(
            res,
            200,
            item
        );

        return;
    }

    // POST /items
    if (method === 'POST' && url === '/items') {

        let body = '';

        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {

                const data = JSON.parse(body);

                const {
                    name,
                    quantity,
                    purchased
                } = data;

                // Validate name
                if (
                    typeof name !== 'string' ||
                    name.trim() === ''
                ) {
                    sendError(
                        res,
                        400,
                        'Name is required'
                    );

                    return;
                }

                // Validate quantity
                if (
                    typeof quantity !== 'number' ||
                    quantity <= 0
                ) {
                    sendError(
                        res,
                        400,
                        'Quantity must be greater than 0'
                    );

                    return;
                }

                // Validate purchased
                if (typeof purchased !== 'boolean') {
                    sendError(
                        res,
                        400,
                        'Purchased must be a boolean'
                    );

                    return;
                }

                const item = addItem(
                    name,
                    quantity,
                    purchased
                );

                sendSuccess(
                    res,
                    201,
                    item
                );

            } catch {

                sendError(
                    res,
                    400,
                    'Invalid JSON'
                );
            }
        });

        return;
    }

    // PUT /items/:id
    if (method === 'PUT' && url.startsWith('/items/')) {

        const id = url.split('/')[2];

        if (!id) {
            sendError(res, 400,'Item ID is required');
            return;
        }

        const existingItem = getItemById(id);

        if (!existingItem) {
            sendError(res, 404,'Item not found');
            return;
        }

        let body = '';

        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {

                const updates = JSON.parse(body);

                // Validate name
                if (
                    updates.name !== undefined &&
                    (
                        typeof updates.name !== 'string' ||
                        updates.name.trim() === ''
                    )
                ) {
                    sendError(res, 400, 'Name must be a non-empty string');
                    return;
                }

                // Validate quantity
                if (
                    updates.quantity !== undefined &&
                    (
                        typeof updates.quantity !== 'number' ||
                        updates.quantity <= 0
                    )
                ) {
                    sendError(res, 400,'Quantity must be greater than 0' );
                    return;
                }

                // Validate purchased
                if (
                    updates.purchased !== undefined &&
                    typeof updates.purchased !== 'boolean'
                ) {
                    sendError( res, 400,'Purchased must be a boolean');
                    return;
                }

                const updatedItem = updateItem(id, updates);
                sendSuccess(res, 200, updatedItem
                );

            } catch {
                sendError(res, 400,'Invalid JSON');
            }
        });

        return;
    }

    // DELETE /items/:id
    if (method === 'DELETE' && url.startsWith('/items/')) {

        const id = url.split('/')[2];

        if (!id) {
            sendError(
                res,
                400,
                'Item ID is required'
            );

            return;
        }

        const deleted = deleteItem(id);

        if (!deleted) {
            sendError(
                res,
                404,
                'Item not found'
            );

            return;
        }

        // 204 No Content
        res.writeHead(204);
        res.end();

        return;
    }

    // Route not found
    sendError(
        res,
        404,
        'Route not found'
    );
}