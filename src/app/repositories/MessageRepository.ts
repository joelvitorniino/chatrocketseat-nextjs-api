import { Messages } from "../model/Messages";

export class MessageRepository {
    async findAll() {
        return await Messages.findAll();
    };

    async create({ author, message }) {
        return await Messages.create({
            author,
            message
        });
    };
};