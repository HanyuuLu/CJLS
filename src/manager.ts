import database from "./database";
import { container } from "./container";
class Manager {
  constructor() {
  }
  registerUser() {
    database.
  }
  grantNewContainer(uuid: string) {
    database.grantContainer(uuid, '111', 1000);
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
