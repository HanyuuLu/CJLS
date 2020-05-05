import Database from "./database";
import { container } from "./container";
class Manager {
  database: Database;
  constructor() {
    this.database = new Database();
  }
  grantNewContainer(uuid: string) {
    this.database.grantContainer(uuid, '111', 1000);
    return this.database.queryContainer(uuid);
  }
  queryContainer(uuid: string) {
    return this.database.queryContainer(uuid);
  }
  gc() {
    this.database.gc();
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
let a = new Manager();
a.grantNewContainer('1');
