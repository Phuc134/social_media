import "./message.css"

import React, {forwardRef} from "react";

const Message = forwardRef(({own, msg}, ref) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src="https://bedental.vn/wp-content/uploads/2022/11/gai-xinh-nguc-bu-7.jpg"
                />
                <p className="messageText">{msg}</p>
            </div>
            <div className="messageBottom"> 1 hour ago</div>
            <div ref={ref}></div>
        </div>
    );
});

export default Message;