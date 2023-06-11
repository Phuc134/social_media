import "./searchUser.css";
import axios from "axios";

import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export default function SearchUser({ user, userCurrent, url, setListUser }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleRemoveFriend = () => {
    axios.post("http://localhost:8800/api/users/remove-friend", {
      "idUser": JSON.parse(localStorage.getItem("user"))._id,
      "idFriend": user._id
    })
      .then((res) => {
        console.log(res);
        axios.post(url, { username: userCurrent.username })
          .then((res1) => {
            console.log(res1.data);
            setListUser(res1.data)
          })
      })
    handleClose();
  }

  const handleClick = () => {
    console.log(userCurrent);
    if (user.check == 0) {
      axios.post("http://localhost:8800/api/users/pending", {
        "idUser": userCurrent._id,
        "idFriend": user._id
      })
        .then((res) => {
          console.log(res);
          axios.post(url, { username: userCurrent.username })
            .then((res1) => {
              setListUser(res1.data)
            })
        })
    }

    if (user.check == 1) {
      handleShow();
    }

    if (user.check == 2) {
      axios.post("http://localhost:8800/api/users/remove-pending", {
        "idUser": userCurrent._id,
        "idFriend": user._id
      })
        .then((res) => {
          console.log(res);
          axios.post(url, { username: userCurrent.username })
            .then((res1) => {
              setListUser(res1.data)
            })
        })
    }

  }
  return (
    <>      <div className="container-invite-user">
      <div className="img-invite-user">
        <img src={user.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + user.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "person/noAvatar.png"}></img>
      </div>
      <div className="info-invite-user">
        <div className="name-invite-user">{user.username}</div>
        <div className="add-invite-user" onClick={() => handleClick()} >{user.check == 0 ? "Add friend" : (user.check == 1 ? "Friend" : "Pending")}</div>
      </div>
    </div>    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có xác nhận hủy kết bạn </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRemoveFriend}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal></>

  );
}
