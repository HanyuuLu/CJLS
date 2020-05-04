import fastify from "fastify";
const userroot = "/api/user";
const containerroot = "/api/server";
//用户注册
const SchemaRegister = {
  schema: {
    body: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" },
        registercode: { type: "string" },
      },
    },
  },
};
//用户更新
const SchemaUpdate = {
  schema: {
    body: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" },
        registercode: { type: "string" },
      },
    },
  },
};
//用户登录
const SchemaLogin = {
  schema: {
    body: {
      tpye: "object",
      properties: {
        username: { type: "string" },
        password: { tpye: "string" },
      },
    },
  },
};
//删除用户
const SchemaDelete = {
  schema: {
    body: {
      type: "object",
      properties: {
        uuid: { tpye: "string" },
      },
    },
  },
};
//查询用户
const SchemaUser = {
  schema: {
    body: {
      type: "object",
      properties: {
        uuid: { tpye: "string" },
      },
    },
  },
};
//查询自身用户信息
const SchemaMe = {
  schema: {
    body: {
      type: "object",
      properties: {
        uuid: { tpye: "string" },
        token: { type: "string" },
      },
    },
  },
};
//查询自身用户信息
const SchemaServer = {
  schema: {
    body: {
      type: "object",
      properties: {
        uuid: { tpye: "string" },
        token: { type: "string" },
      },
    },
  },
};
export async function routes(server: fastify.FastifyInstance, options: any) {
  /**
   * @event 测试存活
   */
  server.get("/", async (request, reply) => {
    return { info: "alive" };
  });
  /**
   * @event 用户注册账号
   */
  server.post(`${userroot}/register`, SchemaRegister, (req, res) => {
    res.code(200).send({ info: "success:" });
  });
  /**
   * @event 用户更新用户信息
   */
  server.post(`${userroot}/update`, SchemaUpdate, (req, res) => {
    res.code(200).send({ info: "success" });
  });
  /**
   * @event 用户登录账号
   */
  server.get(`${userroot}/login`, SchemaLogin, (req, res) => {
    res.code(200).send({
      info: "success",
      token: "1234567890",
      username: "InuiToko",
    });
  });
  /**
   * @event 用户删除账号
   * @warning 非注销！！！
   */
  server.post(`${userroot}/delete`, SchemaDelete, (req, res) => {
    res.code(200).send({
      info: "success",
    });
  });
  /**
   * @event 用户查看其他用户信息
   */
  server.get(`${userroot}/user/:uuid`, SchemaUser, (req, res) => {
    res.code(200).send({
      username: "InuiToko",
      role: "2",
    });
  });
  /**
   * @event 用户获取自身用户信息
   */
  server.get(`${userroot}/me`, SchemaMe, (req, res) => {
    res.code(200).send({
      username: "InuiToko",
      role: "2",
      access: `["course1","course2"]`,
      lastused: 3824839275,
    });
  });
  /**
   * @event 用户获取（开启/重新获取）沙箱
   */
  server.get(`${containerroot}/`, SchemaServer, (req, res) => {
    res.code(200).send({
      address: "https://demo.com/skjdfasdkfh",
      token: "9283rsbdfka",
      starttime: 298342,
      endtime: 298374,
    });
  });
}
