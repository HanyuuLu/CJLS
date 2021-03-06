import database from "./database";
import Token from "./token";
import { container } from "./container";
class Manager {
  constructor() {
    console.log("manager is running");
  }

  /**
   * @argument registercode 管理员分配的激活密钥
   * @argument username 用户选择的用户名
   * @argument password 用户密码
   * @description 用户使用管理员分配的激活密钥设置初始化账户
   */
  userRegister(registercode: string, username: string, password: string) {
    let src = Token.verify(registercode) as {
      uuid: string;
      account: string;
      type: string;
    };
    let userInfo = this.userInfo(src.uuid);
    if (userInfo.username != "") {
      throw new Error("could not apply operation to this account");
    }
    database.userUpdate(src.uuid, username, password);
    return this.userLogin(username, password);
  }

  /**
   * @argument token 管理员令牌
   * @argument count 期望新建的账户个数
   * @returns 注册码列表
   */
  userGrant(
    token: string,
    count: number
  ): { tokenList: Array<string>; status: string } {
    if (count > 0) {
      let src = Token.verify(token) as any;
      if (src.type === "admin") {
        let id = database.userRegister_Batch(count);
        let r = new Array();
        for (var i in id) {
          r.push(Token.sign({ uuid: id[i], type: "register" }, "1y"));
        }
        let res = new Object() as { tokenList: Array<string>; status: string };
        res.tokenList = r;
        res.status = "success";
        return res;
      } else {
        throw new Error("permission denied.");
      }
    } else {
      throw new Error("request not vaild.");
    }
  }

  /**
   * @argument token 用户令牌
   * @argument username 新的用户名
   * @argument password 新的密码哈希
   * @description 用户修改自身信息
   * @throws InvaildToken
   */
  userUpdate(token: string, username: string, password: string) {
    try {
      let src = Token.verify(token) as { uuid: string };
      database.userUpdate(src.uuid, username, password);
    } catch (e) {
      throw e;
    }
  }

  /**
   * @argument token 管理员登录token
   * @returns token 管理令牌
   * @description 管理员使用登陆令牌换取
   */
  userAdmin(token: string) {
    try {
      let src = Token.verify(token) as { uuid: string };
      let usr = database.userQuery_uuid(src.uuid);
      if (usr.role == 1) {
        return Token.sign({ uuid: src.uuid, type: "admin" }, "2h");
      } else {
        throw new Error("no permissions");
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * @argument username 用户名（用于登录）
   * @argument password 密码哈希
   * @returns loginSchema
   * @description 用户登录，返回用户信息
   * @throws WrongUsernameOrPassword
   * @throws InvaildToken, noSuchUser
   */
  userLogin(username: string, password: string) {
    let res = database.userQuery_username(username);
    if (res == null) {
      throw new Error("no such user");
    }
    if (password == res.password) {
      return {
        username: res.username,
        role: res.role,
        access: res.access,
        lastused: res.lastused,
        token: Token.sign(
          {
            uuid: res.uuid,
            type: "login",
          },
          "30d"
        ),
      };
    } else {
      throw new Error("wrong username or password");
    }
  }

  /**
   * @argument token 管理员令牌
   * @argument uuid 待删除账户uuid
   * @description  管理员删除账户
   */
  userDelete(token: string, uuid: string) {
    let t = Token.verify(token) as any;
    let u = this.userInfo(t.uuid);
    if (
      (u.role == 1 && t.type == "admin")
    ) {
      database.userDelete(uuid);
      return { uuid: uuid };
    } else {
      throw new Error("invaild request");
    }
  }
  userInfo(uuid: string) {
    let res = database.userQuery_uuid(uuid);
    if (res == null) {
      throw new Error("no such user");
    }
    delete res.password;
    return res;
  }

  /**
   * @argument uuid 用户令牌
   * @description 用户公开信息
   */
  userQuery(uuid: string) {
    let res = database.userQuery_uuid(uuid);
    if (res != null) {
      return { uuid: res.uuid, username: res.username, lastused: res.lastused };
    } else {
      return { error: "no such user" };
    }
  }
  /**
   * @argument token 用户令牌/管理员令牌
   * @description 用户/管理员删除账户
   */
  /**
   * @argument token 用户令牌
   * @description 用户自身信息
   */
  userSelfInfo(token: string) {
    let uuid = (Token.verify(token) as { uuid: string }).uuid;
    let res = database.userQuery_uuid(uuid);
    if (res != null) {
      return {
        uuid: res.uuid,
        username: res.username,
        access: res.access,
        lastused: res.lastused,
      };
    } else {
      return { error: "no such user" };
    }
  }
  /**
   * @argument token 用户令牌
   * @description 用户创建新实例
   * @returns 新实例地址
   * @throws InvaildToken, ResourceUsed
   */
  grantNewContainer(uuid: string) {
    container.newContainer(uuid);
    database.containerGrant(uuid, "111", 1000 * 60 * 60);
    
    return database.containerQuery(uuid);
  }
  /**
   * @argument uuid 用户令牌
   * @description 用户查询实例地址
   */
  queryContainer(token: string) {
    let uuid = (Token.verify(token) as { uuid:string }).uuid;
    let rec = database.containerQuery(uuid) ?? this.grantNewContainer(uuid);
    return rec;
  }
  /**
   * @description 清理多余记录
   */
  gc() {
    database.gc();
  }
}
let manager = new Manager();
export default manager;
