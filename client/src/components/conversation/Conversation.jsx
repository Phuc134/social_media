import "./conversation.css"

export default function Conversation({name, idConversation, handleClickConversation}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div onClick={() => {
            handleClickConversation(idConversation);
        }} className="conversation">
            <img className="conversationImg" src={PF + "person/noAvatar.png"}
                 alt=""/>
            <span className="conversationName">{name}</span>
        </div>
    )
}