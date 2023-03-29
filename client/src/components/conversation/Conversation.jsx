import "./conversation.css";

export default function Conversation({
  user,
  name,
  idConversation, imgChatGroup,
  handleClickConversation,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div

        onClick={() => {
        handleClickConversation(idConversation, user, imgChatGroup);
      }}
      className="conversation"
    >

      <img
        className="conversationImg"
        src={
          user
            ? user?.profilePicture
              ? PF + user?.profilePicture
              : PF + "person/noAvatar.png"
            : imgChatGroup?
                  PF + imgChatGroup :
                  PF + "person/noAvatar.png"
        }
        alt=""
      />
      <span className="conversationName">{user ? user.username : name}</span>
    </div>
  );
}
