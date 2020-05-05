import Fastify from "fastify";
import { routes } from "./router";
const PORT = 9001;
const ADDRESS = "0.0.0.0";
const server = Fastify({ logger: true });

server.register(routes);
server.listen(PORT, ADDRESS, (err, address) => {
  if (err) {
    console.error(err);
    server.log.error(err);
  }
  server.log.info(`${ADDRESS}:${PORT}`);
  console.log(`${ADDRESS}:${PORT}`);
});
