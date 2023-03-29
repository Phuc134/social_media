import SearchUser from "../../components/searchUser/SearchUser";
import "./searchFriend.css";
import SideBar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
export default function Friend() {
    const location = useLocation();
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get('q');
    const [listUser, setListUser] = useState([]);
    const [userCurrent, setUserCurrent] = useState();
    useEffect(()=> {
        setUserCurrent(JSON.parse(localStorage.getItem("user")));
    },[])
    useEffect(()=>{
        console.log(searchValue);
        axios.post(`http://localhost:8800/api/users/search?q=${searchValue}`,{username: JSON.parse(localStorage.getItem("user")).username})
            .then((res)=> {
                console.log(res.data);
                setListUser(res.data);
            })
    },[searchValue, location.search])
    return (
        <>
            <Topbar />

            <div className="container-friend">
                <div className="side-bar">
                    <SideBar />
                </div>
                <div className="list-search-friend">
                    {listUser.map((item)=> {
                        return  <SearchUser user={item}
                                            userCurrent={userCurrent}
                                            url={`http://localhost:8800/api/users/search?q=${searchValue}`}
                                            setListUser={setListUser}/>
                    })}
                </div>
            </div>
        </>
    );
}
