import http = require('http');
import type { IncomingMessage, ServerResponse } from 'http';

const port = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "Welcome to the Shopping List API!" }));
};

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
})