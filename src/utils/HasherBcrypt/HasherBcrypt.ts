import type Hasher from "./Hasher";
import bcrypt from "bcryptjs";

class HasherBcrypt implements Hasher {
  salt = 10;

  async hash(text: string) {
    const hashedText = await bcrypt.hash(text, this.salt);
    return hashedText;
  }

  async compare(text: string, hashedText: string) {
    const isValidText = await bcrypt.compare(text, hashedText);
    return isValidText;
  }
}

export default HasherBcrypt;
