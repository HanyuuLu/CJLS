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
    let src = Token.verify(token) as any;
    return Array();
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
    // let d = new data();
    // d.queryContainer("1");
    // for (let i = 0; i < 200; ++i) {
    //   d.grantContainer((Math.random() * 100).toFixed(), "demo", 1000 * 60);
    // }
    // let res = d.queryAll();
    // res.forEach((element) => {
    //   console.log(element);
    // });
    container.run();
  }
}
export default new Manager();
console.log(Token.sign({ uuid: "test" }));
var token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoidGVzdCIsImlhdCI6MTU4OTc0NDczMSwiZXhwIjoxNTg5ODMxMTMxfQ.sm9PKONDToQpvbw8SqnrCh0TC_b5ZsF42pv0YYPP5xg`;
try {
  let res = Token.verify(token);
  console.log(res);
} catch (err) {
  console.log(err.message);
}
