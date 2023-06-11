import { io } from 'socket.io-client';

let socketInstance = null;

export const getSocketInstance = async () => {
    if (!socketInstance) {
        //console.warn(HTTP_SOCKET);
        socketInstance = await io('http://localhost:8800');
    }
    return socketInstance;
};
