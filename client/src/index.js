import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {AuthContextProvider} from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.css';
import {SocketProvider} from "./context/SocketContext";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    <React.StrictMode>
        <SocketProvider>
            <AuthContextProvider>
                <App/>

            </AuthContextProvider>
        </SocketProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
