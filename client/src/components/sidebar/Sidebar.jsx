import "./sidebar.css";
import {
  Chat,
  Group,
  WorkOutline,
  AccountCircle,
  Settings
} from "@material-ui/icons";
import {useHistory , Link} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";

export default function Sidebar() {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  }
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">

          <Link to={`/messenger`} style={{ textDecoration: 'none' }}>
            <li className="sidebarListItem" style={{cursor: "pointer"}}>
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>

          <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
            <li className="sidebarListItem" style={{cursor: "pointer"}}>
              <Group className="sidebarIcon" />
              <span className="sidebarListItemText">Friends</span>
            </li>
          </Link>

          <Link to={`/update-user`} style={{ textDecoration: 'none' }}>
            <li className="sidebarListItem" style={{cursor: "pointer"}}>
              <Settings className="sidebarIcon" />
              <span className="sidebarListItemText">Update Account</span>
            </li>
          </Link>

          <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
            <li className="sidebarListItem"style={{cursor: "pointer"}}>
              <AccountCircle className="sidebarIcon" />
              <span className="sidebarListItemText">Profile</span>
            </li>
          </Link>
        </ul>



        <button className="sidebarButton" onClick={handleClick}>Log out</button>

      </div>
    </div>
  );
}
