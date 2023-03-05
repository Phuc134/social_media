import axios from "axios";
import jwt_decode from "jwt-decode";
import {io} from "socket.io-client";


export const loginCall = async (userCredential, dispatch, setSocket) => {

    dispatch({type: "LOGIN_START"});
    try {
        const res = await axios.post("/auth/login", userCredential);
        const user = jwt_decode(res.data.accessToken).user;
        setSocket(io("http://localhost:8800"));
        dispatch({type: "LOGIN_SUCCESS", payload: user});
    } catch (err) {
        dispatch({type: "LOGIN_FAILURE", payload: err});
    }
};

