import { MessageRepository } from "../repositories/MessageRepository";

class MessageController {
    public repository: MessageRepository = new MessageRepository();

    async index() {
        return await this.repository.findAll();
    };

    async store({ author, message }) {
        return await this.repository.create({
            author,
            message
        });
    };
}