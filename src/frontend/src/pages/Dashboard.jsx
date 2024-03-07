import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";

function Dashboard() {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fixedClientId = "aa45d6eb-670c-4019-ad1b-85d07ca73772"; // Replace with your desired fixed clientId
        const ws = new WebSocket(`ws://localhost:3000?clientId=${fixedClientId}`);

        ws.onmessage = (event) => {
            console.log(event);
            var data = JSON.parse(event.data);
            if (typeof data == "string") data = JSON.parse(data);
            if (data.type === "userList") {
                setUsers(data.users);
            } else if (data.type === "message") {
                setChatMessages((prevMessages) => [...prevMessages, data.content]);
            }
        };

        setWs(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "") {
            ws.send(message);
            setMessage("");
        }
    };

    const sendPrivateMessage = () => {
        if (selectedClient && response.trim() !== "") {
            ws.send(`@${selectedClient} ${response}`);
            setResponse("");
        }
    };

    const auth = useAuth();

    return (
        <div>
            <h1>Welcome! {auth.user?.username}</h1>
            <button onClick={() => auth.logOut()} className="btn-submit">
                logout
            </button>
            <h1>Frontend Servidor</h1>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Digite sua mensagem" />
            <button onClick={sendMessage}>Enviar para Todos</button>

            <div id="userList">
                <strong>Usuários Conectados:</strong>
                <br />
                {users.join("<br>")}
            </div>

            <h2>Responder Mensagem:</h2>
            <select id="clientSelect" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                <option value="">Selecionar Cliente</option>
                {users.map((user) => (
                    <option key={user} value={user}>
                        {user}
                    </option>
                ))}
            </select>
            <input type="text" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Digite sua resposta" />
            <button onClick={sendPrivateMessage}>Enviar Resposta</button>

            <div id="chatMessages">
                {chatMessages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
