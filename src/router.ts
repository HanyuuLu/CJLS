import fastify from "fastify";
import manager from "./manager";
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
        token: { type: "string" },
        username: { type: "string" },
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
        token: { type: "string" },
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
        token: { type: "string" },
      },
    },
  },
};
//获取容器链接
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
    try {
      let s = manager.userRegister(
        req.body.registercode,
        req.body.username,
        req.body.password
      ) as any;
      s.status = "success";
      res.code(200).send(s);
    } catch (e) {
      res.code(404).send({ status: "failure", info: e.message });
    }
  });
  /**
   * @event 用户更新用户信息
   */
  server.post(`${userroot}/update`, SchemaUpdate, (req, res) => {
    console.log(req.body.token);
    manager.userUpdate(req.body.uuid, req.body.username, req.body.password);
    res.code(200).send({ info: "success" });
  });
  /**
   * @event 用户登录账号
   * @todo 输出使用固定schmea
   */
  server.post(`${userroot}/login`, SchemaLogin, (req, res) => {
    try {
      let s = manager.userLogin(req.body.username, req.body.password) as any;
      s.status = "success";
      res.code(200).send(s);
    } catch (e) {
      res.code(404).send({ status: "failed", info: e.message });
    }
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
  server.get(`${userroot}/u/:uuid`, (req, res) => {
    console.log(req.params);
    res.code(200).send({
      uuid: req.params.uuid,
      username: "InuiToko",
      role: "2",
    });
  });
  /**
   * @event 用户获取自身用户信息
   */
  server.post(`${userroot}/u`, SchemaMe, (req, res) => {
    res.code(200).send({
      uuid: `${req.body.token}对应的uuid`,
      username: "InuiToko",
      role: "2",
      access: `["course1","course2"]`,
      lastused: 3824839275,
    });
  });
  /**
   * @event 用户获取（开启/重新获取）沙箱
   */
  server.get(`${containerroot}/:token`, (req, res) => {
    res.code(200).send({
      address: "https://demo.com/skjdfasdkfh",
      token: `${req.params.token}`,
      starttime: 298342,
      endtime: 298374,
    });
  });
}
