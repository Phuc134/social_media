import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./updateProfile.css";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useContext, useEffect, useState } from "react";
import { Cancel } from "@material-ui/icons";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
export default function UpdateProfile() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const { user, dispatch } = useContext(AuthContext);
  const [email,setEmail] = useState();
  const [username, setUsername] = useState();
  useEffect(() => {
    if (user) {
      if (user.profilePicture)
        setFile(process.env.REACT_APP_PUBLIC_FOLDER + user.profilePicture);
      else setFile(process.env.REACT_APP_PUBLIC_FOLDER +      "person/noAvatar.png")
      setEmail(user.email);
      setUsername(user.username);
    }
  }, []);
  const clickImage = () => {
    const input = document.getElementById("input-img");
    input.click();
  };
  const handleClick = async () => {
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      const data1 = { fileName: fileName };
      if (password && password == confirmPassword) {
        data.append("password", password);
        data1.password = password;
      } else {
        if (password) console.log("password and confirm password don't match");
      }
      data.append("name", fileName);
      data.append("file", file);

      try {
        await axios.post("/upload", data);
        await axios.put(`/users/update/${user.username}`, data1).then((res) => {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
          window.location.reload();
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  };
  return (
    <>
      <Topbar />
      <div className="update-profile">
        <Sidebar />
        <div className="info-user bold">
          Thông tin cá nhân
          <div className="form">
            <div className="form-update normal">
              <div>
                <div>email</div>
                <InputGroup className="mb-3" style={{ width: "210px" }}>
                  <Form.Control
                      value={email}
                    type="email"
                    readOnly="true"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>{" "}
              </div>
              <div className="username">
                <div>username</div>
                <InputGroup className="mb-3" style={{ width: "210px" }}>
                  <Form.Control
                      value={username}
                    placeholder="Username"
                    readOnly="true"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>{" "}
              </div>

              <div className="password">
                <div>password</div>
                <InputGroup className="mb-3" style={{ width: "210px" }}>
                  <Form.Control
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>{" "}
              </div>
              <div className="password">
                <div>confirm password</div>
                <InputGroup className="mb-3" style={{ width: "210px" }}>
                  <Form.Control
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>{" "}
              </div>

              <div>
                {" "}
                <Button onClick={handleClick} variant="primary">
                  Update
                </Button>{" "}
              </div>
            </div>
            <div className="img-user">
              {file ? (
                file && (
                  <div className="shareImgContainer">
                    <img
                      className="shareImg"
                      src={
                        typeof file == "object"
                          ? URL.createObjectURL(file)
                          : file
                      }
                      alt=""
                    />
                    <Cancel
                      className="shareCancelImg"
                      onClick={() => setFile(null)}
                    />
                  </div>
                )
              ) : (
                <>
                  <img
                    style={{ cursor: "pointer" }}
                    alt="Preview"
                    onClick={clickImage}
                  ></img>
                  <input
                    type="file"
                    id="input-img"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                    style={{ display: "none" }}
                    accept=".jpg, .jpeg, .png"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
