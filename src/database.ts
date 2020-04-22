import { verbose } from "sqlite3";
const sqlite3 = verbose();
const DATABASE_FILE = "container.db";
export class Record {
  Instance = new Record();
  database = new sqlite3.Database(DATABASE_FILE);
  init() {}
  queryContainer(uuid: string): string {
    return "none";
  }
}
