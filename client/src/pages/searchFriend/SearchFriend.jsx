import SearchUser from "../../components/searchUser/SearchUser";
import "./searchFriend.css";
import SideBar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
export default function Friend() {
  return (
    <>
      <Topbar />

      <div className="container-friend">
        <div className="side-bar">
          <SideBar />
        </div>
        <div className="list-search-friend">
          <SearchUser />
          <SearchUser />
          <SearchUser />
          <SearchUser />
        </div>
      </div>
    </>
  );
}
