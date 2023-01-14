import { hashSync } from "bcryptjs";

export const hashPassword = (password: string) => {
    return hashSync(password, 8);
};