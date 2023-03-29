import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";

import {Link, useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [search, setSearch] = useState("");
  const history = useHistory();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      const url = `/search?q=${search}`;
      history.push(url)
    }
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">FaceBook phake</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend"
            className="searchInput"
            onKeyDown={handleKeyPress}
            onChange={(e)=> setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <Link to="/invite-friend">

        <div className="topbarIconItem">
              <Person  style={{color:"white"}}/>
          </div>
        </Link>
          <div className="topbarIconItem">
            <Link to="/messenger"><Chat style={{color:"white"}}/></Link>
          </div>
          <div className="topbarIconItem">
            <Notifications />
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
