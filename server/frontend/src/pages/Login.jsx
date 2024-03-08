import { useState } from "react";
import { useAuth } from "../hooks/AuthProvider";

const Login = () => {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const auth = useAuth();
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            auth.loginAction(input);
            return;
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="w-full flex h-dvh items-center justify-center">
            <form onSubmit={handleSubmitEvent} className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm" data-v0-t="card">
                <div className="flex flex-col p-6 space-y-2">
                    <h3 className="font-semibold whitespace-nowrap tracking-tight text-2xl">Login</h3>
                    <p className="text-sm text-muted-foreground">Enter your email </p>
                </div>
                <div className="p-6 space-y-4">
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Login"
                        aria-describedby="username"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Password"
                        type="password"
                        id="password"
                        name="password"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                </div>
                <div className="flex items-center p-6">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-slate-600 h-10 px-4 py-2 w-full">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
