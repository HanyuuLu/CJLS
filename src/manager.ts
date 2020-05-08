import database from "./database";
import Token from "./token";
import { container } from "./container";
class Manager {
  constructor() {}
  registerUser(registercode: string, username: string, password: string) {
    let src = Token.verify(registercode) as any;
    console.log(src);
    console.log(Date.now());
    database.registerUser(src.uuid, username, password);
  }
  updateUser(token: string, username: string, password: string) {
    let src = Token.verify(token) as any;
    console.log(src);
    database.
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
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoidGVzdCIsImlhdCI6MTU4ODg0MTc3NywiZXhwIjoxNTg4OTI4MTc3fQ.i3lWsTICc32jfMYhojhFSjH9kCK5CrSLLxP7eUSaZ9g`;
