const { getClientChat, saveClientChat, initDb } = require("../db/db");
const { Client } = require("../model/Client");
const { Message } = require("../model/Message");
require("dotenv").config();
const WebSocket = require("ws");
const crypto = require("crypto");

let clientsList = [];
let adminClient;
const adminId = process.env.ADMINID;

initDb().then((data) => {
    console.log("Banco iniciado.");
});

function validateVariable(variable) {
    return variable && variable !== "null" && variable !== "undefined" ? variable : "";
}

function createHash(input) {
    const hash = crypto.createHash("sha256");
    hash.update(input);
    return hash.digest("hex");
}

async function handleConnection(ws, req) {
    const origin = validateVariable(req.headers["origin"]?.split(",")[0].trim());
    const remoteAddress = validateVariable(req.connection.remoteAddress);
    const xForwardedFor = validateVariable(req.headers["x-forwarded-for"]);
    const clientLocationHash = createHash(String(origin) + String(remoteAddress) + String(xForwardedFor));

    const clientId = getClientIdFromUrl(req.url) ?? generateClientId(clientLocationHash);

    const clientData = JSON.parse(decrypt(clientId));
    if (clientData.location !== clientLocationHash) {
        //usuário inválido
        ws.send(
            JSON.stringify({
                success: false,
                message: "token inválido",
            })
        );
        return;
    }

    const isAdmin =
        String(origin).startsWith(process.env.NODE_URL) && adminId == clientId && String(remoteAddress) == "::1"; //Apenas acesso local
    console.log(`isAdmin: ${isAdmin}`);
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

            //envio para a dashboard
            if (adminClient && adminClient.ws.readyState === WebSocket.OPEN) {
                adminClient.ws.send(JSON.stringify(client.toJson()));
            }
        } else {
            const admMessage = new Message(
                `Olá ${client.name}. Como podemos ajudar? Tire sua dúvida abaixo que responderemos o mais breve possível!`,
                "ADM"
            );
            client.addMessage(admMessage);

            clientsList.push(client); //Adiciona a nova conexão na lista de clientes
            setTimeout(() => {
                client.ws.send(
                    JSON.stringify({
                        clientId,
                        message: admMessage.toObject(),
                    })
                );
            }, 1000);
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

function generateClientId(clientLocation) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const data = {
        id,
        location: clientLocation,
    };
    return encrypt(JSON.stringify(data));
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

function encrypt(text) {
    const secret = process.env.CRYPTO_KEY;
    const iv = process.env.CRYPTO_IV;

    let cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
}

function decrypt(text) {
    const secret = process.env.CRYPTO_KEY;
    const iv = process.env.CRYPTO_IV;

    let decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
    let dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
}

module.exports = { handleConnection };
