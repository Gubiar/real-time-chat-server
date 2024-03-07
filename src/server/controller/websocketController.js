const { Client } = require("../model/Client");
const { Message } = require("../model/Message");
require("dotenv").config();
const WebSocket = require("ws");

const clients = new Map();
const adminId = process.env.ADMINID;

function handleConnection(ws, req) {
    const clientId = getClientIdFromUrl(req.url) ?? generateClientId();
    const client = new Client(clientId, "Client Name", ws);
    clients.set(clientId, client);

    ws.on("message", (data, isBinary) => {
        const messageContent = isBinary ? data : data.toString();
        const message = new Message(messageContent.toString(), clientId);
        client.addMessage(message);
        if (clientId !== adminId) {
            const admin = clients.get(adminId);
            if (admin && admin.ws.readyState === WebSocket.OPEN) {
                admin.ws.send(JSON.stringify(message));
                admin.addMessage(message);
            }
        } else {
            const recipientId = getRecipientId(messageContent);
            const recipient = clients.get(recipientId);
            if (recipient && recipient.ws.readyState === WebSocket.OPEN) {
                recipient.ws.send(JSON.stringify(message));
                recipient.addMessage(message);
            }
        }

        printClients();
    });

    ws.on("close", () => {
        clients.delete(clientId);
    });
}

function getRecipientId(data) {
    console.log(data);
    return data;
}

function generateClientId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getClientIdFromUrl(url) {
    const urlParams = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    return urlParams.get("clientId");
}

function printClients() {
    console.log("Clientes ativos: \n");
    clients.forEach((value, key) => {
        console.log(`ClientID: ${key}\n\tValue: ${value.toJson()}\n`);
    });
}

module.exports = { handleConnection };
