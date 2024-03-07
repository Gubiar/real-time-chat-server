/* eslint-disable no-unused-vars */
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
        <div className="grid min-h-screen bg-white md:grid-cols-2" style={{ gridTemplateColumns: "1fr 3fr" }}>
            <aside className="flex flex-col w-full border-b md:max-w-xs md:border-b-0 lg:max-w-sm xl:max-w-xs">
                <div className="flex items-center justify-between p-4 border-gray-200 border-r">
                    <button className="rounded-full w-10 h-10">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle sidebar</span>
                    </button>
                    <a className="flex items-center space-x-2 font-bold" href="#">
                        <span>Usuários Ativos</span>
                    </a>
                    <button className="rounded-full w-10 h-10">
                        <SearchIcon className="h-6 w-6" />
                        <span className="sr-only">Search</span>
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <div className="flex items-center p-4 space-x-3">
                        <UserIcon />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">@jaredpalmer</h4>
                            <p className="text-xs text-gray-500">Jared Palmer</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 space-x-3">
                        <UserIcon />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">@shadcn</h4>
                            <p className="text-xs text-gray-500">Shadcn</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 space-x-3">
                        <UserIcon />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">@maxleiter</h4>
                            <p className="text-xs text-gray-500">Max Leiter</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 space-x-3">
                        <UserIcon />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">@shuding_</h4>
                            <p className="text-xs text-gray-500">Shu</p>
                        </div>
                    </div>
                </nav>
            </aside>
            <div className="flex flex-col min-h-screen">
                <header className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button className="rounded-md -left-2">
                        <ChevronLeftIcon className="h-6 w-6" />
                        <span className="sr-only">Back</span>
                    </button>
                    <div className="flex-1 min-w-0 flex items-center space-x-4">
                        <h1 className="text-lg font-semibold">Jared Palmer</h1>
                    </div>
                    <button className="rounded-md -right-2">
                        <MoreHorizontalIcon className="h-6 w-6" />
                        <span className="sr-only">More</span>
                    </button>
                </header>
                <div className="flex-1 p-4">
                    <div className="grid gap-4">
                        <div className="flex items-start space-x-2">
                            <UserIcon />
                            <div className="rounded-lg border">
                                <p className="p-4 text-sm/relaxed">Salve</p>
                            </div>
                        </div>
                        <div className="flex items-end space-x-2 justify-end">
                            <div className="rounded-lg border max-w-[70%]">
                                <p className="p-4 text-sm/relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, unde voluptates cum ullam quibusdam officiis, dolores nobis
                                    eum velit blanditiis minus suscipit fugiat esse at! Distinctio perferendis quibusdam et tempore.
                                </p>
                            </div>
                            <UserIcon />
                        </div>
                        <div className="flex items-start space-x-2">
                            <UserIcon />
                            <div className="rounded-lg border">
                                <p className="p-4 text-sm/relaxed">Im sorry to hear that. Let me take a look at your account.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronLeftIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

function MoreHorizontalIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function UserIcon() {
    return (
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 bg-blue-500">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-white text-sm">JD</span>
        </span>
    );
}

export default Dashboard;
