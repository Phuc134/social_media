import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function Messenger() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const lastMessageRef = useRef(null);
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [listUser, setListUser] = useState([]);
    const [userCurrent, setUserCurrent] = useState();
    const [chatGroup, setListChatGroup] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }, 50);
    }, [message]);
    useEffect(() => {
        axios.get('http://localhost:8800/api/chat-group/6401a47c38b45f3458016af9')
            .then(res => {
                setListChatGroup(res.data);
                console.log(res);
            });
    }, []);
    const handleSubmit = (e) => {
        if (e.key === "Enter") {

            e.preventDefault();

            setMessage([...message, newMessage])
            setNewMessage('');
        }

    }
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    }
    const handleClickConversation = (e) => {
        axios.get()
    }
    return (
        <>
            <div>
                {console.log(userCurrent)}
                <Topbar/>
                <div className="messenger">
                    <div className="chatMenu">
                        <div className="chatMenuWrapper">
                            <h1 className="title">Chats</h1>
                            <input placeholder="Search for friends" className="chatMenuInput"/>
                            {
                                listUser.map(item => {
                                    return <Conversation setUserCurrent={setUserCurrent}
                                                         idConversation={item.idConversation} user={item.user}/>
                                })
                            }
                        </div>
                    </div>
                    {userCurrent ? <>

                        <div className="chatBox">
                            <div className="chatBotTop">
                                <img className="imgTop"
                                     src={userCurrent.profilePicture ? userCurrent.profilePicture : PF + "person/noAvatar.png"}
                                     alt=""/>
                                <label className="labelTop">{userCurrent.username}</label>


                            </div>
                            <div className="chatBoxWrapper">
                                {message.map((item, index) => (
                                    <Message msg={item} ref={index == message.length - 1 ? lastMessageRef : null}/>
                                ))}
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
