import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function CardUser() {
  return (
    <Card style={{ width: "13rem", height:"20rem"}}>
      <Card.Img variant="top" style={{height:"160px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFKsy4LWl0lu92aYBIldgqN-uDBuPQxJtstwT41qnpQ&s" />
      <Card.Body>
        <Card.Title >Tên</Card.Title>
        <Button variant="primary" style={{width: "100%", marginBottom: "10px"}}>Xác nhận</Button>
          <Button variant="secondary"  style={{width: "100%"}}>Xóa</Button>
      </Card.Body>
    </Card>
  );
}
