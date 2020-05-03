import data from "./database";
import { container } from "./container";
class Manager {
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
a.fun();
