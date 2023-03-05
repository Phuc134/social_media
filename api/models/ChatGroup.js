const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const chatGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        initiator: {
            type: String,
        },
        members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        type: Number,
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("ChatGroup", chatGroupSchema);