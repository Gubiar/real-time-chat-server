const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();
const clientMap = new Map();

const corsOptions = {
    origin: "http://localhost",
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

wss.on("connection", (ws, req) => {
    const clientId = getClientIdFromUrl(req.url) ?? generateClientId(); // Extract clientId from URL
    clients.add(ws);
    clientMap.set(clientId, ws);
    sendConnectedUsers();

    ws.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log(`Mensagem recebida do cliente ${clientId}: ${message}`);
        // Handle private messages if needed
        broadcast(message);
    });

    ws.on("close", (code, data) => {
        const reason = data.toString();
        clients.delete(ws);
        clientMap.delete(clientId);
        sendConnectedUsers();
    });
});

function broadcast(message, isUser) {
    if (isUser) {
        const admin = clientMap.get("yourFixedClientId");
        const jsonMessage = JSON.stringify(message);
        admin.send(jsonMessage);
    } else {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const jsonMessage = JSON.stringify({ type: "message", content: message });
                client.send(jsonMessage);
            }
        });
    }
}

function sendConnectedUsers() {
    const connectedUsers = Array.from(clientMap.keys());
    broadcast(JSON.stringify({ type: "userList", users: connectedUsers }), true);
}

function getClientIdFromUrl(url) {
    const urlParams = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    return urlParams.get("clientId");
}

function generateClientId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket rodando em http://localhost:${PORT}`);
});
