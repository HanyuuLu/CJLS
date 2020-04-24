import data from "./database";
class Manager {
  fun() {
    let d = new data();
    d.queryContainer("1");
    console.log(d.queryAll());
    let a = (Math.random() * 10000).toFixed();
    console.log(a);
    d.grantContainer(a, 3000);
  }
}
let a = new Manager();
a.fun();
