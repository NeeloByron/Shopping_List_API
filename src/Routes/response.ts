
import type { IncomingMessage, ServerResponse } from 'http';
import itemController = require('@/controllers/itemController');

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const method = req.method || '';

 // 1. Route: Get/items 
 if (method === 'GET' && url === '/items') {
  const allItems = itemController.getAllItems();
  res.writeHead(200, {'content-type': 'application/json' });
  return res.end(JSON.stringify(allItems));
 }

 // 2. Route: POST/items
 if (method === 'POST' && url === '/items') {
  const chunks: Buffer[] = [];
  // collect incoming streaming data buffer from the client
  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  // once the full payload body completes transimission
  req.on('end', () => {
    try {
      const bodyString = Buffer.concat(chunks).toString();
      const parsedBody = JSON.parse(bodyString);
      const { name, quantity } = parsedBody;

      // validation
      if (!name || typeof name !== 'string' || name.trim() === '') {
        res.writeHead(400, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({
                     success: false,
                     error: "Validation failed. 'name' (string) and 'quantity' (number) are required fields."
        }));
    }

    if (quantity === undefined || typeof quantity !== 'number' || quantity <=0 ) {
      res.writeHead(400, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        error: "Validation failed. 'quantity' (number > 0) is required."
      }));
    }

    // create the item using controller logic
   const newItem = itemController.addItem(name, quantity);
    res.writeHead(201, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(newItem));

  } catch (error) {
    // intercept unhandled json parsing breakdowns gracefully
    res.writeHead(400, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ 
              success: false, 
              error: 'Invalid JSON format payload.' 
       }));
     }
  });
 return;
}

// 3. dynamic routes starting with (e.g., /items/:id)
 if (url.startsWith('/items/')) {
  const parts = url.split('/'); 
  const id = parts[2];

  if (!id) {
    res.writeHead(400, { 'content-type': 'application/json' });
    return res.end(JSON.stringify ({ 
         success: false, 
         error: 'Missing or malformed item ID in URL.' 
      }));
  }

  // GET /items/:id 
  if (method === 'GET') {
    const item = itemController.getItemById(id);
    if (!item) {
      res.writeHead(404, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ 
           success: false, 
           error: `Item with ID "${id}" not found` 
       }));
    }

    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(item));
  }

  // PUT /items/:id 
  if (method === 'PUT') { 
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const bodyString = Buffer.concat(chunks).toString();
        const updates = JSON.parse(bodyString);

        // Validation BEFORE attempting update
      if (updates.name !== undefined) {
        if (typeof updates.name !== 'string' || updates.name.trim() === '') { 
          res.writeHead(400, { 'content-type': 'application/json' });
           return res.end(JSON.stringify({ 
              success: false, 
              error: "validation failed. Name must be a non-empty string."
            }));
          }
        }

      if (updates.quantity !== undefined) {
        if (typeof updates.quantity !== 'number' || updates.quantity <= 0) { 
        res.writeHead(400, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({
               success: false, 
               error: "Validation failed. Quantity must be a number greater than 0."
              }));
            }
         }


      if (updates.purchased !== undefined) {
        if (typeof updates.purchased !== 'boolean') { 
        res.writeHead(400, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ 
               success: false, 
               error : "Validation failed. Purchased must be a boolean." 
              }))
            }
          }

      const updatedItem = itemController.updateItem(id, updates);
      if (!updatedItem) {
        res.writeHead(404, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          error: `Item with ID "${id}" not found.`
        }));
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(updatedItem));

    } catch (error) {
      res.writeHead(400, { 'content-type': 'application/json' })
      return res.end(JSON.stringify({ 
           success: false, 
           error: "Invalid JSON format."
          }));
        }
     });
  return;
 }

  // DELETE /items/:id 
  if (method === 'DELETE') {
      const wasDeleted = itemController.deleteItem(id);
      if (!wasDeleted) {
        res.writeHead(404, { 'content-Type' : 'application/json'});
        return res.end(JSON.stringify({ 
          success: false, 
          error: `Item with ID "${id}" not found.`}));
      }

      // 204 No Content means sucess but we don't send any data back
       res.writeHead(204);
       return res.end();
  }
     }

// default fallback: 404 Endpoint handler for unknown routes
res.writeHead(404, { 'content-type': 'application/json' });
res.end(JSON.stringify({ 
  success: false, 
  error: 'Endpoint not found.'
 }));
};
