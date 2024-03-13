/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";
import ClientItemList from "../components/clientItemList";
import Message from "../components/message";

function Dashboard() {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState("");
    const [selectedClientIndex, setSelectedClientIndex] = useState(-1);
    const [clients, setClients] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const fixedClientId =
            "c34d78748c29f8b124cd378273b11519a5189bee88cd05ca2dbe975707711af27540b5a355bb2313091b7293cb9bc8cbcc19f88da187aaed49268531e1b4e47d2a4f9258251beda147b8c2fc6c8dd5bcc2e4f5982cfa53649aaaccfdcc99b9d84354466130dcccf3e1a25ac29290621b";
        const ws = new WebSocket(`ws://localhost:3000?clientId=${fixedClientId}`);

        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (typeof data == "string") data = JSON.parse(data);
            console.log(data);

            if (data.isRemoveClient) {
                setClients((prevClients) => {
                    const updatedClients = prevClients.filter((client) => String(client.id) !== String(data.id));
                    return [...updatedClients];
                });
            } else {
                setClients((prevClients) => {
                    const updatedClients = prevClients.filter((client) => String(client.id) !== String(data.id));
                    return [data, ...updatedClients];
                });
            }
        };

        setWs(ws);

        return () => {
            ws.close();
        };
    }, []);

    const handleSubmit = () => {
        if (ws != null && inputValue != "") {
            const response = {
                isAdm: true,
                reciver: clients[selectedClientIndex].id,
                message: inputValue,
            };
            console.log(response);
            ws.send(JSON.stringify(response));
            setInputValue("");
        }
    };

    return (
        <div className="grid min-h-screen bg-white md:grid-cols-5">
            <aside className="flex flex-col col-span-1 w-full border-b md:max-w-xs md:border-b-0 lg:max-w-sm xl:max-w-xs border-slate-400 border-r">
                <div className="flex items-center justify-between p-4">
                    <a className="flex items-center space-x-2 font-bold" href="#">
                        <span>Usuários Ativos</span>
                    </a>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    {Array.from(clients).map((cada, index) => (
                        <button onClick={() => setSelectedClientIndex(index)} key={cada.id}>
                            <ClientItemList id={cada.id} nome={cada.name} />
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="flex flex-col min-h-screen col-span-4">
                <div className="h-full max-h-[calc(100dvh-100px)] relative">
                    <header className="flex items-center justify-between p-4 border-b border-gray-200 absolute top-0 left-0 right-0 bg-white z-10">
                        <button className="rounded-md -left-2" onClick={() => setSelectedClientIndex(-1)}>
                            <ChevronLeftIcon className="h-6 w-6" />
                            <span className="sr-only">Back</span>
                        </button>
                        <div className="flex-1 min-w-0 flex items-center space-x-4">
                            <h1 className="text-lg font-semibold">
                                {selectedClientIndex > -1 && clients.length > 0
                                    ? clients[selectedClientIndex].name
                                    : "Selecione um cliente"}
                            </h1>
                        </div>
                        {/* <button className="rounded-md -right-2">
                            <MoreHorizontalIcon className="h-6 w-6" />
                        </button> */}
                    </header>
                    <div className="flex-1 p-4 pb-12 mt-16 h-full max-h-[calc(100%-60px)] overflow-y-scroll">
                        <div className="grid gap-4">
                            {selectedClientIndex > -1 && clients[selectedClientIndex]?.chatHistory ? (
                                Array.from(clients[selectedClientIndex].chatHistory).map((cada, index) => (
                                    <Message key={index} isAdm={cada.sender == "ADM"} message={cada} />
                                ))
                            ) : (
                                <h1 className="m-auto">Sem mensagens</h1>
                            )}
                        </div>
                    </div>
                </div>
                {selectedClientIndex > -1 && clients[selectedClientIndex]?.chatHistory ? (
                    <footer className="flex flex-row items-center w-full gap-4 pr-4 pl-4 h-14">
                        <input
                            className="w-full h-11 border-solid border-slate-700 border rounded flex p-4 items-center transition-all ease-linear"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            className="button-hover-child hover:bg-blue-600 transition-bg ease-linear duration-300 rounded flex items-center justify-center p-4"
                            onClick={handleSubmit}
                        >
                            <SendIcon />
                        </button>
                    </footer>
                ) : undefined}
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

import * as React from "react";

function SendIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-send-horizontal"
            {...props}
        >
            <path d="M3 3l3 9-3 9 19-9zM6 12h16" />
        </svg>
    );
}

export default Dashboard;
