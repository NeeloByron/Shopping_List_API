// Server entry point & routing
import http = require('http')
import type { IncomingMessage, ServerResponse } from 'http';

const port = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, {"content-type": "application/json"});
  res.end(JSON.stringify({ message: "Testing"}));
}

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server is running natively on http://localhost:${port}`);
});