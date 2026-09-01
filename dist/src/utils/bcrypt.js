import bcrypt from "bcrypt";
export async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}
export async function comparePassword(password, hash) {
    const isPassOk = await bcrypt.compare(password, hash);
    return isPassOk;
}
