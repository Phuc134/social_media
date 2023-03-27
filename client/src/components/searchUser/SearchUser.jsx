import "./searchUser.css";
export default function SearchUser({user}) {
  return (
    <div className="container-invite-user">
      <div className="img-invite-user">
        <img src={user.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + user.profilePicture :process.env.REACT_APP_PUBLIC_FOLDER + "person/noAvatar.png" }></img>
      </div>
      <div className="info-invite-user">
        <div className="name-invite-user">{user.username}</div>
        <div className="add-invite-user" >{user.check == 0 ? "Add friend" : "Friend"}</div>
      </div>
    </div>
  );
}
