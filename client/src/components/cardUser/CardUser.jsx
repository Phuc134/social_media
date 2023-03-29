import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

export default function CardUser({refreshPage, imgUser, user, idUser, url, setListCard}) {

    const handleOnClick = async () => {
        console.log(idUser);
        console.log(user._id);
        await axios.post('http://localhost:8800/api/chat-group/', {
            members: [idUser, user._id]
        })
        await axios.post(`http://localhost:8800/api/users/friend`,{idUser: idUser, idFriend: user._id})
        axios.get(`/users/get-pending/${JSON.parse(localStorage.getItem("user"))._id}`)
            .then(res => {
                setListCard(res.data[0] ? res.data[0].listReceive : res.data);
            })

    }
    const handleOnCancle = () => {
        axios.post(`http://localhost:8800/api/users/remove-pending`,{idUser: user._id, idFriend:  idUser})
            .then(res => {
                axios.get(url)
                    .then(res1 =>
                    {
                        console.log(res1);
                        setListCard(res1.data[0].listReceive);
                    })
            })
    }
  return (
    <Card style={{ width: "13rem", height:"20rem"}}>
      <Card.Img variant="top" style={{height:"160px"}} src={imgUser?process.env.REACT_APP_PUBLIC_FOLDER+ imgUser : process.env.REACT_APP_PUBLIC_FOLDER + "person/noAvatar.png" } />
      <Card.Body>
        <Card.Title >{user.username}</Card.Title>
        <Button variant="primary" onClick={()=> handleOnClick()} style={{width: "100%", marginBottom: "10px"}}>Xác nhận</Button>
          <Button variant="secondary"  onClick={() => handleOnCancle()} style={{width: "100%"}}>Xóa</Button>
      </Card.Body>
    </Card>
  );
}
