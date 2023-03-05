import "./conversation.css"

export default function Conversation({user, setUserCurrent}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div onClick={() => {
            setUserCurrent(user);
        }} className="conversation">
            <img className="conversationImg" src={user.coverPicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"}
                 alt=""/>
            <span className="conversationName">{user.username}</span>
        </div>
    )
}