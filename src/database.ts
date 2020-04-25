import sqlite3 from "better-sqlite3";
import fs from "fs";
const DATABASE_FILE = "container.db";
export default class Record {
  database: sqlite3.Database;
  _tableExist: sqlite3.Statement;
  // _tableCreate: sqlite3.Statement;
  _query: sqlite3.Statement;
  _grant: sqlite3.Statement;
  _queryAll: sqlite3.Statement;
  _queryCountByUUID: sqlite3.Statement;
  _insertNewRec: sqlite3.Statement;
  _gc: sqlite3.Statement;
  constructor() {
    // try {
    //   if (!fs.existsSync(DATABASE_FILE)) {
    //     fs.close(fs.openSync(DATABASE_FILE, "w"), null);
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
    this.database = sqlite3(DATABASE_FILE);
    this._tableExist = this.database.prepare(
      "select count(*) from sqlite_master where type='table' and name='contaier'"
    );

    this._query = this.database.prepare("select * from container where uuid=?");
    this._grant = this.database.prepare(
      "insert into container (uuid,container,start,end) values(?,?,?,?)"
    );
    this._queryAll = this.database.prepare("select * from container");
    this._queryCountByUUID = this.database.prepare(
      "select count(*) from container where uuid=?"
    );
    this._insertNewRec = this.database.prepare(
      "insert into container (uuid,container,start,end) values(?,?,?,?)"
    );
    this._gc = this.database.prepare("delete from container where end<?");
    if (this._tableExist.get() == 0) {
      let _tableCreate = this.database.prepare(
        "CREATE TABLE container (uuid integer,container string,start integer,end integer,primary key(uuid))"
      );
      _tableCreate.run();
    }
  }
  queryContainer(uuid: string): object {
    return this._query.get(uuid);
  }
  queryAll(): Array<Object> {
    this.gc();
    return this._queryAll.all();
  }
  grantContainer(uuid: string, address: string, time: number): boolean {
    this.gc();
    if (this._queryCountByUUID.get(uuid) == 0) {
      let now = Date.now();
      this._insertNewRec.run(uuid, address, now, now + time);
      return true;
    }
    return false;
  }
  gc() {
    this._gc.run(Date.now());
  }
}
