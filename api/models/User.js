const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        listInvite: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'

        }],
        listReceive:  [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'

        }],
        friends: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }]
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);
