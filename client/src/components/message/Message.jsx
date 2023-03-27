import "./message.css";

import React, { forwardRef } from "react";

const Message = forwardRef(({ own, msg, user }, ref) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            user.profilePicture
              ? process.env.REACT_APP_PUBLIC_FOLDER + user?.profilePicture
              : process.env.REACT_APP_PUBLIC_FOLDER + "person/noAvatar.png"
          }
        />
        <p className="messageText">{msg}</p>
      </div>
      <div className="messageBottom"> 1 hour ago</div>
      <div ref={ref}></div>
    </div>
  );
});

export default Message;
