import data from "./database";
class Manager {
  fun() {
    console.log("log");
    let d = new data();
    d.queryContainer("1");
  }
}
let a = new Manager();
a.fun();
