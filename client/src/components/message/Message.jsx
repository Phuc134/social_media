import "./message.css"

export default function Message({own, msg}){
    return(
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg"
                    src="https://bedental.vn/wp-content/uploads/2022/11/gai-xinh-nguc-bu-7.jpg"/>
                <p className="messageText">{msg}</p>
            </div>
            <div className="messageBottom"> 1 hour ago</div>
        </div>
    )
}