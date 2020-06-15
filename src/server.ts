import Fastify from "fastify";
import { routes } from "./router";
const PORT = 80;
const ADDRESS = "::";
const server = Fastify({ logger: false });

server.register(routes);
server.listen(PORT, ADDRESS, (err, address) => {
  if (err) {
    console.error(err);
    server.log.error(err);
  }
  server.log.info(`${ADDRESS}:${PORT}`);
  console.log(`${ADDRESS}:${PORT}`);
});
