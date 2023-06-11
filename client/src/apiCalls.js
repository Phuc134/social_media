import axios from "axios";
import jwt_decode from "jwt-decode";

export const loginCall = async (userCredential, dispatch) => {
    dispatch({type: "LOGIN_START"});
    try {
        const res = await axios.post("/auth/login", userCredential);
        const user = jwt_decode(res.data.accessToken).user;

        dispatch({type: "LOGIN_SUCCESS", payload: user});
    } catch (err) {
        dispatch({type: "LOGIN_FAILURE", payload: err});
    }
};

