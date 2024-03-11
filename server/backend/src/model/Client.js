class Client {
    constructor(id, name, ws) {
        this.id = id;
        this.name = name;
        this.ws = ws;
        this.chatHistory = [];
    }

    addMessage(message) {
        this.chatHistory.push(message);
    }

    toJson() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            chatHistory: this.chatHistory.map((message) => {
                console.log(message.toObject());
                return message.toObject();
            }),
        });
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            chatHistory: this.chatHistory.map((message) => message.toObject()),
        };
    }

    static fromJson(json) {
        const data = JSON.parse(json);
        const client = new Client(data.id, data.name, null);
        client.chatHistory = data.chatHistory.map(Message.fromJson);
        return client;
    }
}

module.exports = { Client };
