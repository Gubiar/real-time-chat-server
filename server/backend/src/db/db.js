const mysql = require("mysql2/promise");

let connection;

async function initDb() {
    try {
        connection = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            port: process.env.DBPORT,
            password: process.env.DBPASSWORD,
            database: process.env.DATABASE,
        });

        connection.addListener("error", (err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

async function saveClientChat(client) {
    console.log("-------saveClientChat()-------\n");
    if (!connection) {
        console.log("Banco não conectado");
        return;
    }

    const sql = "SELECT * FROM `historico` WHERE `cliente` = ?";
    const values = [client.id];

    try {
        const [rows] = await connection.execute(sql, values);

        console.log(rows.length > 0);

        if (rows.length > 0) {
            // UPDATE
            console.log("update");
            await handleQuerySafety(
                "UPDATE `historico` SET `conteudo` = AES_ENCRYPT(?, ?) WHERE `cliente` = ? LIMIT 1",
                [client.toJson(), process.env.DBAESKEY, client.id]
            );
        } else {
            // INSERT
            console.log("insert");
            await handleQuerySafety("INSERT INTO `historico`(`cliente`, `conteudo`) VALUES (?, AES_ENCRYPT(?, ?))", [
                client.id,
                client.toJson(),
                process.env.DBAESKEY,
            ]);
        }
    } catch (error) {
        console.log(error);
    }
}

async function getClientChat(clientId) {
    console.log("-------getClientChat()-------\n");
    try {
        if (!connection) {
            console.log("Banco não conectado");
            return;
        }

        const result = await handleQuerySafety(
            "SELECT CAST(AES_DECRYPT(conteudo, ?) as CHAR) as conteudo FROM historico where cliente = ?",
            [process.env.DBAESKEY, clientId]
        );

        return result;
    } catch (error) {
        console.log(error);
    }
}

async function handleQuerySafety(sql, values) {
    try {
        const [rows] = await connection.execute(sql, values);

        if (rows && rows.length > 0 && rows[0].conteudo) {
            return rows[0].conteudo;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { initDb, saveClientChat, getClientChat };
