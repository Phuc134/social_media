import './comment.css'
export default function Comment({text}){
    return(
            <div className="commentDetail">
                <img className="img" src="https://bedental.vn/wp-content/uploads/2022/11/gai-xinh-nguc-bu-7.jpg"/>
                <div className="comment" style={{display:"flex", flexDirection:"column"}}>
                    <p className="user" style={{fontWeight:"800"}}>Name</p>
                    <p >{text} </p>
                </div>
            </div>
    )
}