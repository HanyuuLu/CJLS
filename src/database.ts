import sqlite3 from "better-sqlite3";
import fs from "fs";
const DATABASE_FILE = "server.db";
class Record {
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
  _user_queryByUUID: sqlite3.Statement;
  _user_queryBuUsernmae: sqlite3.Statement;
  // _user_queryAll: sqlite3.Statement;
  constructor() {
    this.database = sqlite3(DATABASE_FILE);
    this.database.exec(`
      begin;
      create table if not exists container
        (
          uuid      integer primary key autoincrement,
          container string not null,
          start     integer not null,
          end       integer not null
        );
      create table if not exists user
        (
          uuid      integer primary key,
          password  string,
          username  string,
          role      integer not null default 0,
          access    string default '[]',
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
      (container,start,end) 
      values(?,?,?)
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
    this._user_queryBuUsernmae = this.database.prepare(`
      select * from user
      where username=?;
    `);
    this._user_queryByUUID = this.database.prepare(`
      select * from user
      where uuid=?;
    `);
    this._user_add = this.database.prepare(`
      insert into user
      (username)
      values 
      (?);
    `);
    this._user_update = this.database.prepare(`
      update user set
      username = ?,
      password = ?
      where uuid = ?
    `);
    this._user_delete = this.database.prepare(`
      delete from user
      where uuid = ?
    `);
  }

  /**
   * @argument uuid 用户uuid
   */
  userQuery_uuid(
    uuid: string
  ): {
    uuid: string;
    password: string;
    username: string;
    role: number;
    access: string;
    lastused: string;
  } {
    return this._user_queryByUUID.get(uuid);
  }

  /**
   * @argument username 用户uuid
   */
  userQuery_username(
    username: string
  ): {
    uuid: string;
    password: string;
    username: string;
    role: number;
    access: string;
    lastused: string;
  } {
    return this._user_queryBuUsernmae.get(username);
  }

  /**
   * @argument uuid 用户uuid
   * @argument password 用户密码哈希
   * @description 获得许可用户注册（初始化）
   */
  userRegister(username: string, password: string) {
    return this._user_add.run(username, password);
  }

  /**
   * @argument uuid 用户uuid
   * @argument password 用户密码哈希
   * @description 更新用户信息
   * @throws usernameTooShort
   */
  userUpdate(uuid: string, username: string, password: string) {
    if (username.length < 1) {
      throw new Error("username too short");
    }
    this._user_update.run(username, password, uuid);
  }

  /**
   * @argument uuid 用户uud
   * @argument role 用户身份 0 普通用户 1 管理员
   * @description 修改用户权限
   */
  userModify(uuid: string, role: number) {}

  /**
   * @argument number
   * @description 批量注册用户
   */
  userRegister_Batch(count: number) {
    return this.database.transaction((count) => {
      var res = Array();
      for (var i = 0; i < count; ++i) {
        var code = this._user_add.run("");
        res.push(code.lastInsertRowid);
      }
      return res;
    })(count);
  }

  /**
   * @argument uuid 用户uuid
   * @description 删除用户
   */
  userDelete(uuid: string) {
    this._user_delete.run(uuid);
  }

  /**
   * @argument uuid
   * @description 查询uuid对应用户的容器记录
   */
  containerQuery(uuid: string): object {
    return this._container_query.get(uuid);
  }

  /**
   * @argument
   * @description 查询所有容器（管理员用）
   */
  containerQuery_all(): Array<Object> {
    this.gc();
    return this._container_queryAll.all();
  }

  /**
   * @argument uuid:string,address:string,time:number
   * @description 为uuid对应用户分配可用时长为time的容器，并返回容器访问地址
   */
  containerGrant(uuid: string, address: string, time: number): boolean {
    this.gc();
    if (this._container_queryCountByUUID.get(uuid).count === 0) {
      let now = Date.now();
      this._container_insertNewRec.run(uuid, address, now, now + time);
      return true;
    }
    return false;
  }

  /**
   * @argument
   * @description 清理过期容器
   */
  gc() {
    this._container_gc.run(Date.now());
  }
}
export default new Record();
