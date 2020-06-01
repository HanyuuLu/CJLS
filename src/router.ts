import fastify from "fastify";
import manager from "./manager";
const userroot = "/api/user";
const containerroot = "/api/server";

export async function routes(server: fastify.FastifyInstance, options: any) {
  server.get("/test", async (req, rep) => {
    rep.send(manager.userLogin("hanyuu", "123"));
  });

  /**
   * @event 测试存活
   */
  server.get("/", async (request, reply) => {
    return { info: "alive~", version: "0.0.1alpha" };
  });

  /**
   * @event 用户注册账号
   */
  server.post(
    `${userroot}/register`,
    {
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
    },
    (req, res) => {
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
    }
  );

  /**
   * @event 用户更新用户信息
   */
  server.post(
    `${userroot}/update`,
    {
      schema: {
        body: {
          type: "object",
          properties: {
            token: { type: "string" },
            username: { type: "string" },
          },
        },
      },
    },
    (req, res) => {
      try {
        manager.userUpdate(req.body.uuid, req.body.username, req.body.password);
        res.code(200).send({ info: "success" });
      } catch (e) {
        res.code(403).send({ status: "failure", info: e.message });
      }
    }
  );

  /**
   * @event 用户登录账号
   */
  server.post(
    `${userroot}/login`,
    {
      schema: {
        body: {
          tpye: "object",
          properties: {
            username: { type: "string" },
            password: { tpye: "string" },
          },
        },
      },
    },
    (req, res) => {
      try {
        let s = manager.userLogin(req.body.username, req.body.password) as any;
        s.status = "success";
        res.code(200).send(s);
      } catch (e) {
        res.code(404).send({ status: "failed", info: e.message });
      }
    }
  );

  /**
   * @event 管理员用户获取管理令牌
   */
  server.post(
    `${userroot}/admin`,
    {
      schema: {
        body: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
      },
    },
    (req, ret) => {
      try {
        let r = new Object() as { token: string; status: string };
        r.token = manager.userAdmin(req.body.token) as any;
        r.status = "success";
        ret.code(200).send(r);
      } catch (e) {
        ret.code(403).send({ status: "failure", info: e.message });
      }
    }
  );

  /**
   * @event 管理员批量注册账户
   */
  server.post(
    `${userroot}/grant`,
    {
      schema: {
        body: {
          type: "object",
          properties: {
            token: { type: "string" },
            count: { type: "string" },
          },
        },
      },
    },
    (req, ret) => {
      try {
        ret.code(200).send(manager.userGrant(req.body.token, req.body.count));
      } catch (e) {
        ret.code(403).send({ status: "failure", info: e.message });
      }
    }
  );

  /**
   * @event 用户删除账号
   * @warning 非注销！！！
   */
  server.post(
    `${userroot}/delete`,
    {
      schema: {
        body: {
          type: "object",
          properties: {
            token: { type: "string" },
            uuid: { tpye: "string" },
          },
        },
      },
    },
    (req, res) => {
      res.code(200).send({
        info: "success",
      });
    }
  );

  /**
   * @event 用户查看其他用户信息
   */
  server.get(`${userroot}/u/:uuid`, (req, res) => {
    try {
      let s = manager.userQuery(req.params.uuid) as any;
      s.status = "success";
      res.code(200).send(s);
    } catch (e) {
      res.code(403).send({ status: "failure", info: e.message });
    }
  });

  /**
   * @event 用户获取自身用户信息
   */
  server.post(
    `${userroot}/u`,
    {
      schema: {
        body: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
      },
    },
    (req, res) => {
      try {
        let s = manager.userSelfInfo(req.body.token) as any;
        s.status = "success";
        res.code(200).send(s);
      } catch (e) {
        res.code(403).send({ status: "failure", info: e.message });
      }
    }
  );

  /**
   * @event 用户获取（开启/重新获取）沙箱
   */
  server.get(`${containerroot}/:token`, (req, res) => {
    try {
      let s = manager.queryContainer(req.params.token) as any;
      s.status = "success";
      res.code(200).send(s);
    } catch (e) {
      res.code(403).send({ status: "failure", info: e.message });
    }
  });
}
