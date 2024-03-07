const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { handleConnection } = require("./controller/websocketController");
const { corsOptions } = require("./config/corsConfig");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());

console.log(__dirname);
app.use(express.static(path.join(__dirname, "../frontend/dist/")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Rota para realizar o login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Comparar com os valores do arquivo .env
    const envUsername = process.env.USERNAME;
    const envPassword = process.env.PASSWORD;

    if (username === envUsername && password === envPassword) {
        // Gera um token JWT com uma chave secreta (deve ser segura em um ambiente de produção)
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            data: {
                user: {
                    username: "Gustavo",
                },
            },
            token,
        });
    } else {
        res.status(401).json({
            message: "Credenciais inválidas",
        });
    }
});

wss.on("connection", handleConnection);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket rodando em http://localhost:${PORT}`);
});
