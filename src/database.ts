import sqlite3 from "better-sqlite3";
import fs from "fs";
const DATABASE_FILE = "server.db";
export default class Record {
  database: sqlite3.Database;
  _container_query: sqlite3.Statement;
  _container_grant: sqlite3.Statement;
  _container_queryAll: sqlite3.Statement;
  _container_queryCountByUUID: sqlite3.Statement;
  _container_insertNewRec: sqlite3.Statement;
  _container_gc: sqlite3.Statement;
  _user_add: sqlite3.Statement;
  _user_update: sqlite3.Statement;
  _user_delete: sqlite3.Statement;
  // _user_queryByUUID: sqlite3.Statement;
  // _user_queryAll: sqlite3.Statement;
  constructor() {
    // try {
    //   if (!fs.existsSync(DATABASE_FILE)) {
    //     fs.close(fs.openSync(DATABASE_FILE, "w"), null);
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
    this.database = sqlite3(DATABASE_FILE);
    this.database.exec(`
      begin;
      create table if not exists container
        (
          uuid      integer primary key,
          container string not null,
          start     integer not null,
          end       integer not null
        );
      create table if not exists user
        (
          uuid      integer primary key,
          username  text,
          role      integer not null default 0,
          access    string default '[]'
          lastused  integer
        );
      commit;
      `);
    this._container_query = this.database.prepare(`
      select *
      from container
      where uuid=?
      `);
    this._container_grant = this.database.prepare(`
      insert into container 
      (uuid,container,start,end) 
      values(?,?,?,?)
      `);
    this._container_queryAll = this.database.prepare(`
      select *
      from container
    `);
    this._container_queryCountByUUID = this.database.prepare(`
      select count(*) as count
      from container 
      where uuid=?
    `);
    this._container_insertNewRec = this.database.prepare(`
      insert into container 
      (uuid,container,start,end)
       values(?,?,?,?)
    `);
    this._container_gc = this.database.prepare(`
      delete from container
      where end<?
    `);
    this._user_add = this.database.prepare(`
      insert into user 
      (uuid,username,level,lastused) values
      (?,?,0,${Date.now()})
    `);
    this._user_update = this.database.prepare(`
      update user set
      username = ?
      where uuid = ?
    `);
    this._user_delete = this.database.prepare(`
      delete from user
      where uuid = ?
    `);
  }
  queryContainer(uuid: string): object {
    return this._container_query.get(uuid);
  }
  queryAll(): Array<Object> {
    this.gc();
    return this._container_queryAll.all();
  }
  grantContainer(uuid: string, address: string, time: number): boolean {
    this.gc();
    if (this._container_queryCountByUUID.get(uuid).count === 0) {
      let now = Date.now();
      this._container_insertNewRec.run(uuid, address, now, now + time);
      return true;
    }
    return false;
  }
  gc() {
    this._container_gc.run(Date.now());
  }
}
