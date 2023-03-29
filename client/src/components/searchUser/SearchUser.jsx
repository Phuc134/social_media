import "./searchUser.css";
import axios from "axios";
export default function SearchUser({user, userCurrent, url, setListUser}) {
    const handleClick = () => {
        console.log(userCurrent);
        if (user.check == 0){
            axios.post("http://localhost:8800/api/users/pending",{
                "idUser": userCurrent._id,
                "idFriend": user._id
            })
                .then((res)=> {
                    console.log(res);
                    axios.post(url, {username: userCurrent.username})
                        .then((res1)=>{
                            setListUser(res1.data)
                        })
                })
        }

        if (user.check == 2){
            axios.post("http://localhost:8800/api/users/remove-pending",{
                "idUser": userCurrent._id,
                "idFriend": user._id
            })
                .then((res)=> {
                    console.log(res);
                    axios.post(url, {username: userCurrent.username})
                        .then((res1)=>{
                            setListUser(res1.data)
                        })
                })
        }

    }
  return (
    <div className="container-invite-user">
      <div className="img-invite-user">
        <img src={user.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + user.profilePicture :process.env.REACT_APP_PUBLIC_FOLDER + "person/noAvatar.png" }></img>
      </div>
      <div className="info-invite-user">
        <div className="name-invite-user">{user.username}</div>
        <div className="add-invite-user" onClick={()=> handleClick()} >{user.check == 0 ? "Add friend" : (user.check == 1 ? "Friend" : "Pending")}</div>
      </div>
    </div>
  );
}
