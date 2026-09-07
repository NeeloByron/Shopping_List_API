// Server entry point & routing
import http = require('http');
import type { IncomingMessage, ServerResponse } from 'http';

// controller method using commonJS
const itemController = require('@/controllers/itemController');
const port = 3000;

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

      // simple validation guard checks
      if (!name || typeof name !== 'string' || !quantity || typeof quantity !== 'number') {
        res.writeHead(400, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({
                     success: false,
                     error: "Validation failed. 'name' (string) and 'quantity' (number) are required fields."
        }));
    }

    // create the item using controller logic
    const newItem = itemController.addItem(name, quantity);
    res.writeHead(201, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(newItem));

  } catch (error) {
    // intercept unhandled json parsing breakdowns gracefully
    res.writeHead(400, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ success: false, error: 'Invalid JSON format payload.' }));
  }
 });
 return;
}

// handle dynamic paths (e.g., /items/1)
 if (url.startsWith('/items/')) {
  const parts = url.split('/');
  // grabs the value right after the second slash  
  const id = parts[2];

  if (!id || id.trim() === '') {
    res.writeHead(400, { 'content-type': 'application/json' });
    return res.end(JSON.stringify ({ success: false, error: 'Missing or malformed item ID in URL.' }));
  }

  // Route: GET /items/:id (FETCH single item details)
  if (method === 'GET') {
    const item = itemController.getItemById(id);
    if (!item) {
      res.writeHead(404, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: `Item with ID "${id}" not found` }))
    }

    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(item));
  }


  // Route: PUT /items/:id (update partial item details)
  if (method === 'PUT') { 
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const bodyString = Buffer.concat(chunks).toString();
        const updates = JSON.parse(bodyString);

        // Strict validation guards for optional fields
        if (updates.name !== undefined && typeof updates.name !== 'string' || updates.name.trim() === '') {
          res.writeHead(400, { 'content-type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: "validation failed. Name must be a non-empty string."}));
      }
      if (updates.quantity !== undefined && typeof updates.quantity !== 'number') {
        res.writeHead(400, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: "Validation failed. Quantity must be a number greater than 0."}));
      }
      if (updates.purchased !== undefined && typeof updates.purchased !== 'boolean') {
        res.writeHead(400, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error : `Item with ID "${id}" not found.` }))
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(updateItem));
    } catch (error) {
      res.writeHead(400, { 'content-type': 'application/json' })
    }
  }

 }         

// default fallback   
res.writeHead(404, { 'content-type': 'application/json' });
res.end(JSON.stringify({ success: false, error: 'Endpoint not found.' }));

};

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server is running natively on http://localhost:${port}`);
});