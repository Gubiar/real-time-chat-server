import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createBrowserHistory } from "history";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AuthProvider from "../hooks/AuthProvider";
import PrivateRoute from "../router/route";
import PageNotFound from "./404";

const history = createBrowserHistory();

function App() {
    return (
        <div className="App">
            <Router history={history}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
