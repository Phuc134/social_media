const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        chatGroupId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup'
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        text: {
            type: String,
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Message", MessageSchema);
