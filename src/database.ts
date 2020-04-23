import sqlite3 from "sqlite3";
import fs from "fs";
const sqlite = sqlite3.verbose();
const DATABASE_FILE = "container.db";
export default class Record {
  Instance = new Record();
  database: sqlite3.Database;
  constructor() {
    this.database = new sqlite.Database(DATABASE_FILE);
    try {
      if (!fs.existsSync(DATABASE_FILE)) {
        fs.openSync(DATABASE_FILE, "w");
      }
    } catch (e) {
      console.error(e);
    }
  }
  queryContainer(uuid: string): string {
    this.database.get(
      `select * from container where uuid==${uuid}`,
      (err, res) => {
        res.forEach((element: any) => {
          console.log(element);
        });
      }
    );
    return "none";
  }
}
