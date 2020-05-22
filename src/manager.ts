import database from "./database";
import Token from "./token";
import { container } from "./container";
class Manager {
  constructor() {}
  /**
   * @argument registercode 管理员分配的激活密钥
   * @argument username 用户选择的用户名
   * @argument password 用户密码
   * @description 用户使用管理员分配的激活密钥设置初始化账户
   */
  registerUser(registercode: string, username: string, password: string) {
    let src = Token.verify(registercode) as any;
    console.log(src);
    console.log(Date.now());
    database.updateUser(src.uuid, username, password);
  }
  /**
   * @argument token 管理员令牌
   * @argument count 期望新建的账户个数
   * @returns 注册码列表
   */
  grantUser(token: string, count: number): Array<string> {
    if (count > 0 && count < 65536) {
      let src = Token.verify(token) as any;
      let res = database.registerUser_Batch(count);
      return res;
    } else {
      throw Error("request not vaild.");
    }
  }

  updateUser(token: string, username: string, password: string) {
    let src = Token.verify(token) as any;
    console.log(src);
    database.updateUser(src.uuid, username, password);
  }
  grantNewContainer(uuid: string) {
    database.grantContainer(uuid, "111", 1000);
    return database.queryContainer(uuid);
  }
  queryContainer(uuid: string) {
    return database.queryContainer(uuid);
  }
  gc() {
    database.gc();
  }
  fun() {
    container.run();
  }
}
let manager = new Manager();
export default manager;
var token = Token.sign({ uuid: "test" });
console.log(token);
let res = Token.verify(token);
manager.grantUser(token, 20);
try {
  console.log(res);
} catch (err) {
  console.log(err.message);
}
