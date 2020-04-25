import sqlite3 from "better-sqlite3";
import fs from "fs";
const DATABASE_FILE = "container.db";
export default class Record {
  database: sqlite3.Database;
  query: sqlite3.Statement;
  grant: sqlite3.Statement;
  constructor() {
    this.database = sqlite3(DATABASE_FILE);
    this.query = this.database.prepare("select * from container where uuid=?");
    this.grant = this.database.prepare(
      "insert into container (uuid,container,start,end) values(?,?,?,?)"
    );
    try {
      if (!fs.existsSync(DATABASE_FILE)) {
        fs.openSync(DATABASE_FILE, "w");
      }
    } catch (e) {
      console.error(e);
    }
    if (
      this.database
        .prepare(
          "select count(*) from sqlite_master where type='table' and name='contaier"
        )
        .get() == 0
    ) {
      this.database
        .prepare(
          "CREATE TABLE container (uuid integer,container string,start integer,end integer,primary key(uuid))"
        )
        .run();
    }
  }
  queryContainer(uuid: string): object {
    return this.query.get(uuid);
  }
  queryAll(): object {
    return this.database.prepare("select * from container").get();
  }
  grantContainer(uuid: string, time: number) {
    let now = Date.now();
    this.database
      .prepare(
        "insert into container (uuid,container,start,end) values(?,?,?,?)"
      )
      .run(uuid, "demoIP", now, now + time);
  }
}
