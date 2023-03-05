import "./testPost.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
export default function TestPost({ post }) {
    const [user, setUser] = useState({});
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState("");
    const [listComment, setListComment] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [post.userId]);
    const handleEnter = (e) =>{
        if (e.key === "Enter") {
            e.preventDefault();
            setListComment([...listComment, comment])
            setComment('');
            console.log(listComment);
        }
    }
    const onChangeInput = (e) => {
        setComment(e.target.value);
    }
    const likeHandler = () => {
        try {
            axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
        } catch (err) {}
    };
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <div>
                            <Link to={`/profile/${user.username}`}>
                            <img
                                className="postProfileImg"
                                src={
                                    user.profilePicture
                                        ? PF + user.profilePicture
                                        : PF + "person/noAvatar.png"
                                }
                                alt=""
                            />
                            </Link>
                        </div>
                        <div className="titleLeft">
                            <span className="postUsername">{user.username}</span>
                            <span className="postDate">{format(post.createdAt)}</span>
                        </div>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img className="postImg" src={PF + post.img} alt="" />
                </div>
                <div className="total">
                    <div className="postBottomLeft">
                        <ThumbUpTwoToneIcon className="iconLike"/>
                        <FavoriteTwoToneIcon className="iconHeart"/>
                        <span className="postLikeCounter">3 people like it</span>
                    </div>


                </div>
                <div className="postBottom">
                    <div className="btnLike"><ThumbUpOffAltIcon/> Like
                        <div className="listIcon">
                            <ThumbUpTwoToneIcon className="iconLike"/>
                            <FavoriteTwoToneIcon className="iconHeart"/>
                            <SentimentDissatisfiedTwoToneIcon className="iconAngry"/>
                        </div>
                    </div>

                    <div className="btnComment" onClick={ () => {
                        setShowCommentInput(!showCommentInput);
                    }}> <ChatBubbleOutlineIcon/> Comment</div>
                    <div className="btnShare"> <ShareIcon/> Share</div>
                </div>
                { showCommentInput &&
                    <>
                    <div className="listComment">
                        {listComment.map((item)=> (
                            <Comment text={item}/>
                        ))}
                    </div>
                        <div className="aa">
                            <img className="img" src="https://bedental.vn/wp-content/uploads/2022/11/gai-xinh-nguc-bu-7.jpg"/>
                            <input type="test" onKeyPress={handleEnter}  value={comment} onChange={onChangeInput} className="inputText"/>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
