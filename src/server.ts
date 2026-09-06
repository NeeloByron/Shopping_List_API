// Server entry point & routing
import http = require('http');
import type { IncomingMessage, ServerResponse } from 'http';

// controller method using commonJS
const itemController = require('@/controllers/itemController');

const port = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
 // 1. Route: Get/items 
 if (req.method === 'GET' && req.url === '/items') {
  const allItems = itemController.getAllItems();
  res.writeHead(200, {'content-type': 'application/json' });
  return res.end(JSON.stringify(allItems));
 }

 // 2. Route: POST/items
 if (req.method === 'POST' && req.url === '/items') {
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

// 3. Fallback: 404 Endpoint handler for unknown routes
res.writeHead(404, { 'content-type': 'application/json' });
res.end(JSON.stringify({ success: false, error: 'Endpoint not found.' }));

};

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server is running natively on http://localhost:${port}`);
});