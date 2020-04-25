import data from "./database";
class Manager {
  fun() {
    let d = new data();
    d.queryContainer("1");
    let res = d.queryAll();
    res.forEach((element) => {
      console.log(element);
    });
    let a = (Math.random() * 1000).toFixed();
    console.log(a);
    d.grantContainer(a, 1000 * 60);
  }
}
let a = new Manager();
a.fun();
