import "./inviteFriend.css"
import CardUser from "../../components/cardUser/CardUser";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
export default function InviteFriend(){
    return <>
        <Topbar/>
        <div className="container-invite-user1">
            <div className="sidebar-invite-user">
                <Sidebar/>
            </div>
            <div className="list-invite-friend">
                <CardUser/>
                <CardUser/>
                <CardUser/>
                <CardUser/> <CardUser/>
                <CardUser/> <CardUser/>
                <CardUser/>


            </div>
        </div>

    </>
}