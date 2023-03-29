import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import SendIcon from "@mui/icons-material/Send";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CreateChatGroup from "../../components/createChatGroup/CreateChatGroup";

export default function Messenger({ socket }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const lastMessageRef = useRef(null);
  const [infoChat, setInfoChat] = useState(null);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userCurrent, setUserCurrent] = useState();
  const [listChatGroup, setListChatGroup] = useState([]);
  const infoChatRef = useRef(null);
  const [imgTop, setImgTop] = useState(null);
  useEffect(() => {
    setUserCurrent(JSON.parse(localStorage.getItem("user")));
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
  useEffect(() => {
    infoChatRef.current = infoChat?._id;
  }, [infoChat?._id]);
  useEffect(() => {
    axios
      .get(
        `http://localhost:8800/api/chat-group/${
          JSON.parse(localStorage.getItem("user"))._id
        }`
      )
      .then((res) => {
        setListChatGroup(res.data);
        socket.emit("add_room", { listRoom: res.data, id: JSON.parse(localStorage.getItem("user"))._id
        });
      });
    socket.on("receive_message", ({ text, user, idRoom }) => {
      const rs = {
        text: text,
        user: Array.of(user),
      };
      if (idRoom == infoChatRef.current) {
        setMessage((prev) => [...prev, rs]);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {});
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const msg = newMessage;
      axios
        .post("http://localhost:8800/api/chat-group/message", {
          chatGroupId: infoChat._id,
          authorId: userCurrent._id,
          text: newMessage,
        })
        .then((res) => {
          const rs = {
            text: msg,
            user: Array.of(userCurrent),
          };
          socket.emit("send_message", {
            msg,
            userCurrent,
            idRoom: infoChat._id,
          });
          setMessage((prev) => [...prev, rs]);
        })
        .catch((e) => {
          console.log(e.message);
        });
      setNewMessage("");
    }
  };
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleClickConversation = (idChat, user, imgChatGroup) => {
    setImgTop( user
        ? user?.profilePicture
            ? PF + user?.profilePicture
            : PF + "person/noAvatar.png"
        : imgChatGroup?
            PF + imgChatGroup :
            PF + "person/noAvatar.png")
    axios
      .get(`http://localhost:8800/api/chat-group/${userCurrent._id}/${idChat}`)
      .then((res) => {
        setMessage(res.data[0].messages ? res.data[0].messages : []);
        setInfoChat(res.data[0]);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmitCreateChat = async (tags, name, file) => {
    const members = [];
    for (let i = 0; i < tags.length; i++) {
      members.push(tags[i].id);
    }
    const initiator = userCurrent._id;
    members.push(userCurrent._id);
    let fileName;
    if (file) {
      const data = new FormData();
      fileName = Date.now() + file.name;
      const data1 = { fileName: fileName };
      data.append("name", fileName);
      data.append("file", file);
      await axios.post("/upload", data);
    }
    console.log(fileName);
    axios.post(`chat-group`, { members, initiator,name,  fileName }).then((res) => {
      axios
        .get(
          `http://localhost:8800/api/chat-group/${
            JSON.parse(localStorage.getItem("user"))._id
          }`
        )
        .then((res) => {
          setListChatGroup(res.data);
          console.log(res.data);
          socket.emit("add_room_update", { listRoom: res.data });
          handleClose();
        });
    });
  };
  return (
    <>
      <div>
        <Topbar />
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Tạo Nhóm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateChatGroup
              idUser={userCurrent?._id}
              handleClose={handleClose}
              handleSubmitCreateChat={handleSubmitCreateChat}
            />
          </Modal.Body>
        </Modal>
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper" style={{ overflow: "auto" }}>
              <h1 className="title">
                Chats
                <ControlPointIcon
                  onClick={handleShow}
                  style={{
                    float: "right",
                    marginRight: "60px",
                    marginTop: "4px",
                    cursor: "pointer",
                  }}
                />
              </h1>
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
              />
              {listChatGroup.map((item) => {
                console.log(item);
                return (
                  <Conversation
                    key={item._id}
                    user={item.user}
                    name={item.name}
                    imgChatGroup={item.imgChatGroup}
                    handleClickConversation={handleClickConversation}
                    idConversation={item._id}
                  />
                );
              })}
            </div>
          </div>
          {infoChat ? (
            <>

              <div className="chatBox">
                <div className="chatBotTop" style={{width: "635px"}}>
                  <img
                    className="imgTop"
                    src={
                     imgTop
                    }
                    alt=""
                  />
                  <label className="labelTop">
                    {infoChat?.user ? infoChat?.user.username : infoChat.name}
                  </label>
                </div>
                <div className="chatBoxWrapper">
                  {message.map((item, index) => {
                    return (
                      <Message
                        key={index}
                        msg={item.text}
                        user={item.user[0]}
                        own={userCurrent._id == item.user[0]._id ? true : false}
                        ref={lastMessageRef}
                      />
                    );
                  })}
                </div>
                <div className="chatBoxBottom">
                  <input
                    onKeyPress={handleSubmit}
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    className="textInput"
                    placeholder="write something ..."
                  ></input>
                  <div onClick={handleSubmit} className="divSend">
                    <SendIcon className="iconSend" />
                  </div>
                </div>
              </div>
              <div className="chatOnline">
                <img
                  className="imgLeft"
                  src={
                    userCurrent.profilePicture
                      ? userCurrent.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <label className="nameLeft">{userCurrent.username}</label>
                <i>
                  <div style={{ cursor: "pointer", margin: "10px" }}>
                    <FacebookIcon className="iconFb" />
                  </div>
                  <div style={{ fontWeight: "300", fontSize: "15px" }}>
                    Profile
                  </div>
                </i>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
