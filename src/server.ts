import Fastify from "fastify";
const PORT = 8000;
const ADDRESS = "0.0.0.0";
const server = Fastify();
console.log("run");
server.get("/", (req, res) => {
  console.log(res.res);
  res.code(200).send({ pong: "it works!" });
});

server.listen(PORT, (err, address) => {
  if (err) {
    server.log.error(err);
  }
  server.log.info(address);
});
