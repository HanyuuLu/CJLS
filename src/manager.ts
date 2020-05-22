import database from "./database";
import Token from "./token";
import { container } from "./container";
class Manager {
  constructor() {
    //功能测试
    this.fun();
  }
  /**
   * @argument registercode 管理员分配的激活密钥
   * @argument username 用户选择的用户名
   * @argument password 用户密码
   * @description 用户使用管理员分配的激活密钥设置初始化账户
   */
  userRegister(registercode: string, username: string, password: string) {
    let src = Token.verify(registercode) as { uuid: string };
    database.userUpdate(src.uuid, username, password);
  }
  /**
   * @argument token 管理员令牌
   * @argument count 期望新建的账户个数
   * @returns 注册码列表
   */
  userGrant(token: string, count: number): Array<string> {
    if (count > 0 && count < 65536) {
      let src = Token.verify(token) as any;
      let res = database.userRegister_Batch(count);
      return res;
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
   *
   */
  userLogin(username: string, password: string) {
    let res = database.userQuery_username(username);
    if (password == res.password) {
      return Token.sign({ uuid: res.uuid, type: "login" }, "30d");
    } else {
      throw new Error("wrong username or password");
    }
  }
  /**
   * @argument token 用户令牌
   * @description 用户创建新实例
   * @returns 新实例地址
   * @throws InvaildToken, ResourceUsed
   */
  grantNewContainer(token: string) {
    let src = Token.verify(token) as { uuid: string };
    let uuid = src.uuid;
    database.containerGrant(uuid, "111", 1000);
    return database.containerQuery(uuid);
  }
  queryContainer(uuid: string) {
    return database.containerQuery(uuid);
  }
  gc() {
    database.gc();
  }
  fun() {
    // container.run();
    let res = this.userLogin("hanyuu", "123");
    console.log(res);
    console.log(Token.verify(res));
  }
}
let manager = new Manager();
export default manager;
