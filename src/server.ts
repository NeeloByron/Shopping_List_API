// Server entry point & routing
import http from 'http';
import { requestHandler } from './Routes/response';

const port = 4001;

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server is running natively on http://localhost:${port}`);
});