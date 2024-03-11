const { getClientChat, saveClientChat, initDb } = require("../db/db");
const { Client } = require("../model/Client");
const { Message } = require("../model/Message");
require("dotenv").config();
const WebSocket = require("ws");

let clientsList = [];
let adminClient;
const adminId = process.env.ADMINID;

initDb().then((data) => {
    console.log("Banco iniciado.");
});

async function handleConnection(ws, req) {
    const origin = req.headers["origin"].split(",")[0].trim();
    const clientId = getClientIdFromUrl(req.url) ?? generateClientId();
    const isAdmin = String(origin).startsWith(process.env.NODE_URL) && adminId == clientId;
    if (isAdmin) {
        adminClient = new Client(clientId, "Administrador", ws);
    } else {
        const name = getClientNameFromUrl(req.url);
        const client = new Client(clientId, name ?? "Cliente 1", ws);

        const historicoCliente = await getClientChat(client.id);

        if (historicoCliente) {
            const data = JSON.parse(historicoCliente);

            if (data) {
                const chatHistory = Array.from(data.chatHistory);
                chatHistory.forEach((element) => {
                    const messageToSend = new Message(element.content, element.sender);
                    client.addMessage(messageToSend);
                    client.ws.send(messageToSend.toJson());
                });
            }
            clientsList.push(client); // Adiciona a nova conexão na lista de clientes
        } else {
            const admMessage = new Message(
                `Olá ${client.name}. Como podemos ajudar? Tire sua dúvida abaixo que responderemos o mais breve possível!`,
                "ADM"
            );
            client.addMessage(admMessage);

            clientsList.push(client); //Adiciona a nova conexão na lista de clientes
            client.ws.send(
                JSON.stringify({
                    clientId,
                    message: admMessage.toObject(),
                })
            );
        }

        await saveClientChat(client);
    }

    ws.on("message", async (data, isBinary) => {
        const message = isBinary ? data : JSON.parse(data);

        if (message.isAdm) {
            //resposta do adm para cliente
            const clientIndex = clientsList.findIndex((cada) => {
                return String(cada.id) == String(message.reciver);
            });

            if (clientIndex > -1) {
                //enviar ao cliente
                const messageToSend = new Message(message.message, "ADM");
                clientsList[clientIndex].ws.send(messageToSend.toJson());
                clientsList[clientIndex].addMessage(messageToSend);

                //Atualiza a dashboard
                if (adminClient && adminClient.ws.readyState === WebSocket.OPEN) {
                    adminClient.ws.send(clientsList[clientIndex].toJson());
                }

                //salva no banco
                await saveClientChat(clientsList[clientIndex]);
            }
        } else {
            //Mensagem do cliente para o ADM
            const clientIndex = clientsList.findIndex((cada) => {
                return String(cada.id) == String(message.clientId);
            });

            if (clientIndex > -1) {
                clientsList[clientIndex].addMessage(new Message(message.message, "client"));

                //envio para a dashboard
                if (adminClient && adminClient.ws.readyState === WebSocket.OPEN) {
                    adminClient.ws.send(JSON.stringify(clientsList[clientIndex].toJson()));
                }

                //salva no banco
                await saveClientChat(clientsList[clientIndex]);
            }
        }

        printClients();
    });

    ws.on("close", () => {
        let clientIdClose;
        clientsList = clientsList.filter((client) => {
            if (client.ws == ws) {
                clientIdClose = client.id;
                console.log(`clientIdClose -> ${clientIdClose}`);
                return false;
            }
            return true;
        });

        //verifica se a desconexão foi do adm
        if (adminClient.ws == ws) adminClient = undefined;

        //Atualiza a dashboard
        if (adminClient && adminClient.ws.readyState === WebSocket.OPEN) {
            adminClient.ws.send(
                JSON.stringify({
                    isRemoveClient: true,
                    id: clientIdClose,
                })
            );
        }
    });
}

function generateClientId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getClientIdFromUrl(url) {
    const urlParams = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    return urlParams.get("clientId");
}

function getClientNameFromUrl(url) {
    const urlParams = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    return urlParams.get("name");
}

function printClients() {
    console.log("Clientes ativos: \n");
    clientsList.forEach((value, key) => {
        console.log(JSON.stringify(value.toObject()));
    });
}

module.exports = { handleConnection };
