import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function Messenger({socket}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const lastMessageRef = useRef(null);
    const [infoChat, setInfoChat] = useState(null);
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userCurrent, setUserCurrent] = useState();
    const [listChatGroup, setListChatGroup] = useState([]);
    useEffect(() => {
        setUserCurrent(JSON.parse(localStorage.getItem('user')));
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({behavior: "smooth"});
            console.log(lastMessageRef);
        }
    }, [message]);
    useEffect(() => {
        axios.get(`http://localhost:8800/api/chat-group/${JSON.parse(localStorage.getItem('user'))._id}`)
            .then(res => {
                setListChatGroup(res.data);
                socket.emit('add_room', {listRoom: res.data});
                console.log(res);
            });
        socket.on('receive_message', ({text, user}) => {
            const rs = {
                text: text,
                user: Array.of(user),
            }
            setMessage((prev) =>
                [...prev, rs]
            )
        })
        return () => {
            socket.disconnect();
        }
    }, []);
    const handleSubmit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log(infoChat._id);
            const msg = newMessage;
            axios.post('http://localhost:8800/api/chat-group/message', {
                "chatGroupId": infoChat._id,
                "authorId": userCurrent._id,
                "text": newMessage
            }).then((res) => {
                const rs = {
                    text: msg,
                    user: Array.of(userCurrent),
                }
                socket.emit('send_message', {msg, userCurrent, idRoom: infoChat._id});
                setMessage((prev) =>
                    [...prev, rs]
                )
            })
                .catch(e => {
                    console.log(e.message)
                })
            setNewMessage('');
        }

    }
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    }
    const handleClickConversation = (idChat) => {
        axios.get(`http://localhost:8800/api/chat-group/${userCurrent._id}/${idChat}`)
            .then(res => {
                console.log(res);
                setMessage(res.data[0].messages);
                setInfoChat(res.data[0]);
            })
            .catch(e => {
                console.log(e.message);
            })
    }
    return (
        <>
            <div>
                <Topbar/>
                <div className="messenger">
                    <div className="chatMenu">
                        <div className="chatMenuWrapper">
                            <h1 className="title">Chats</h1>
                            <input placeholder="Search for friends" className="chatMenuInput"/>
                            {
                                listChatGroup.map(item => {
                                    return <Conversation user={userCurrent}
                                                         name={item.name}
                                                         handleClickConversation={handleClickConversation}
                                                         idConversation={item._id}/>
                                })
                            }
                        </div>
                    </div>
                    {infoChat ? <>
                        <div className="chatBox">
                            <div className="chatBotTop">
                                <img className="imgTop"
                                     src={userCurrent.profilePicture ? userCurrent.profilePicture : PF + "person/noAvatar.png"}
                                     alt=""/>
                                <label className="labelTop">{userCurrent.username}</label>
                            </div>
                            <div className="chatBoxWrapper">
                                {message.map((item, index) => {

                                    return (
                                        <Message msg={item.text}
                                                 own={userCurrent._id == item.user[0]._id ? true : false}
                                                 ref={lastMessageRef}/>
                                    )
                                })}
                            </div>
                            <div className="chatBoxBottom">
                                <input onKeyPress={handleSubmit} type="text" value={newMessage}
                                       onChange={handleInputChange}
                                       className="textInput" placeholder="write something ..."></input>
                                <div onClick={handleSubmit} className="divSend">
                                    <SendIcon className="iconSend"/>
                                </div>
                            </div>
                        </div>
                        <div className="chatOnline">
                            <img className="imgLeft"
                                 src={userCurrent.profilePicture ? userCurrent.profilePicture : PF + "person/noAvatar.png"}
                                 alt=""/>
                            <label className="nameLeft">{userCurrent.username}</label>
                            <i>
                                <div style={{cursor: "pointer", margin: "10px"}}><FacebookIcon className="iconFb"/>
                                </div>
                                <div style={{fontWeight: "300", fontSize: "15px"}}>Profile</div>
                            </i>
                        </div>
                    </> : null
                    }
                </div>
            </div>
        </>
    );
}
