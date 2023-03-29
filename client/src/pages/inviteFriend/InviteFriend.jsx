import "./inviteFriend.css"
import CardUser from "../../components/cardUser/CardUser";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import {useEffect, useState} from "react";
import axios from "axios";
export default function InviteFriend(){
    const [listCard, setListCard] = useState([]);
    const  refreshPage = () =>{
        window.location.reload();

    }
    useEffect(() => {

        axios.get(`/users/get-pending/${JSON.parse(localStorage.getItem("user"))._id}`)
            .then(res => {
               setListCard(res.data[0] ? res.data[0].listReceive : res.data);
            })
    },[])
    return <>
        <Topbar/>
        <div className="container-invite-user1">
            <div className="sidebar-invite-user">
                <Sidebar/>
            </div>
            <div className="list-invite-friend">
                {console.log(listCard)}
                {listCard?.map(item => {
                    console.log(item);
                    return <CardUser
                        refreshPage={refreshPage}
                        setListCard={setListCard}
                        idUser = {JSON.parse(localStorage.getItem("user"))._id}
                        url={`/users/get-pending/${JSON.parse(localStorage.getItem("user"))._id}`}
                        imgUser = {item.user[0]?.profilePicture}
                        user = {item.user[0]}/>
                })}
            </div>
        </div>

    </>
}