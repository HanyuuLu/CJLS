/**
 * @description 签发token并自动生成持续性密钥模块
 * @author HanyuuLu
 */
import jwt from "jsonwebtoken";
import fs from "fs";

class Token {
  private secrect: string;
  constructor() {
    this.secrect = "";
    while (this.secrect == "") {
      try {
        this.secrect = fs.readFileSync("secrect").toString();
      } catch {
        let sec = "";
        for (var i = 0; i < 512; ++i) {
          sec += Math.floor(Math.random() * 10).toString();
        }
        fs.writeFileSync("secrect", sec);
      }
    }
  }
  /**
   * @argument load 载体
   * @argument expire 超时时间
   * @description 签发token，默认24h
   */
  sign(load: object, expire: string = "24h") {
    return jwt.sign(load, this.secrect, { expiresIn: expire });
  }
  /**
   * @argument src 待验证的token
   * @description 验证token
   */
  verify(src: string) {
    return jwt.verify(src, this.secrect);
  }
}
export default new Token();
