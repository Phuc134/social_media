import "./CreateChatGroup.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Form from "react-bootstrap/Form";
import SearchIcon from "@mui/icons-material/Search";
import { WithContext as ReactTags } from "react-tag-input";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
const CreateChatGroup = ({ handleClose, handleSubmitCreateChat, idUser }) => {
  const [file, setFile] = useState();
  const [name, setName] = useState();
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    axios
      .get(`/users/${idUser}`)
      .then((res) => {
        const suggestions1 = [];
        console.log(res.data[0]);
        for (let i = 0; i < res.data[0].friends.length; i++) {
          const item = res.data[0].friends[i];
          suggestions1.push({ id: item._id[0], text: item.username[0] });
        }
        setSuggestions(suggestions1);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const [tags, setTags] = useState([]);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    console.log(tag);
    console.log(suggestions);
    suggestions.find((item) => {
      console.log(item.id == tag.id);
      if (item.id == tag.id) setTags([...tags, tag]);
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log("The tag at index " + index + " was clicked");
  };
  const handleOnClick = () => {
    const input = document.getElementById("img-create-chat-group");
    input.click();
  };

  return (
    <>
      <div className="container-create-chat">
        <div className="input-name-container">
          <div>
            {file ? (
              <img
                className="img-group"
                onClick={handleOnClick}
                src={typeof file == "object" ? URL.createObjectURL(file) : file}
              />
            ) : (
              <CameraAltIcon className="img-group" onClick={handleOnClick} />
            )}
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              accept=".jpg, .jpeg, .png"
              id="img-create-chat-group"
              style={{ display: "none" }}
            />
          </div>
          <div className="input-name">
            <Form.Control
              required={true}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên nhóm"
              aria-label="Tên nhóm"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div style={{ margin: "10px 0px" }}>Thêm bạn vào nhóm</div>
        <div className="input-add-members">
          <ReactTags
            tags={tags}
            suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            minQueryLength={1}
            handleTagClick={handleTagClick}
            inputFieldPosition="top"
            autocomplete
          />
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button
            disabled={tags.length > 1 ? false : true}
            variant="primary"
            onClick={() => handleSubmitCreateChat(tags, name)}
          >
            Tạo nhóm
          </Button>
        </Modal.Footer>
      </div>
    </>
  );
};
export default CreateChatGroup;
