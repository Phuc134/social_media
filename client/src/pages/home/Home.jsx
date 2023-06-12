import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"
import { getSocketInstance } from "../../connectSocket";
import { useEffect } from "react";
import { toast } from 'react-toastify';

export default function Home() {
  useEffect(()=>{
    const getSocket = async() => {
        const socket = await getSocketInstance();
        socket.on("notification_friend", ({username}) => {
            toast.success(`${username} accepted your friend request`)
        })
    }
    getSocket();
  
},[])
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed/>
        <Rightbar/>
      </div>
    </>
  );
}
