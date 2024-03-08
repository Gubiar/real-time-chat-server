class Message {
    constructor(content, sender, timestamp = new Date()) {
        this.content = content;
        this.sender = sender;
        this.timestamp = timestamp;
    }

    toJson() {
        return JSON.stringify({
            content: this.content,
            sender: this.sender,
            timestamp: this.timestamp,
        });
    }

    toObject() {
        return {
            content: this.content,
            sender: this.sender,
            timestamp: this.timestamp,
        };
    }

    static fromJson(json) {
        const data = JSON.parse(json);
        return new Message(data.content, data.sender, new Date(data.timestamp));
    }
}

module.exports = { Message };
