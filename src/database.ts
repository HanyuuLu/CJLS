import sqlite3 from "better-sqlite3";
import fs from "fs";
const DATABASE_FILE = "container.db";
export default class Record {
  database: sqlite3.Database;
  constructor() {
    this.database = sqlite3(DATABASE_FILE);
    try {
      if (!fs.existsSync(DATABASE_FILE)) {
        fs.openSync(DATABASE_FILE, "w");
      }
    } catch (e) {
      console.error(e);
    }
  }
  queryContainer(uuid: string): string {
    let res = this.database
      .prepare(`select * from container where uuid=`)
      .get(uuid);
    console.log(res);
    return "none";
  }
}
