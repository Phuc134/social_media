const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {

}
exports.refreshToken = async (req, res) => {
}
exports.logOut = async (req, res) => {

}
exports.updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
}

exports.deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
}

exports.getUserById = async (req, res) => {
    try {
        res.json(await User.find({}));
    } catch (e) {

    }
    // const userId = req.query.userId;
    // const username = req.query.username;
    // try {
    //   const user = userId
    //     ? await User.findById(userId)
    //     : await User.findOne({ username: username });
    //   const { password, updatedAt, ...other } = user._doc;
    //   res.status(200).json(other);
    // } catch (err) {
    //   res.status(500).json(err);
    // }
}

exports.addFriend = async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const idFriend = req.body.idFriend;
        const user = await User.findOne({_id: idUser});
        user.friends.push(idFriend);
        const friend = await User.findOne({_id: idFriend});
        friend.friends.push(idUser);
        friend.save();
        user.save();
        res.status(200).json("add success");
    } catch (e) {
        res.status(500).json(e.message);
    }
}