import jwt from 'jsonwebtoken';
import fs from 'fs';
class token {
    secrect: string;
    constructor() {
        this.secrect = "";
        while (this.secrect == "") {
            try {
                this.secrect = fs.readFileSync("secrect").toString();
            } catch{
                fs.writeFileSync('secrect', Math.floor(Math.random() * 10e10))
            }
        }
    }
    sign(load: object) {
        return jwt.sign(load, this.secrect, { expiresIn: '24h' })
    }
    verify(src: string) {
        return jwt.verify(src, this.secrect)
    }
}
export default new token()