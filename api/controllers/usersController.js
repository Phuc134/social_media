const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.signUp = async (req, res) => {

}

exports.refreshToken = async (req, res) => {
}

exports.logOut = async (req, res) => {

}

exports.searchUser = async(req, res) => {
    const regex = new RegExp(req.query.name,"i");
    const listUser = await  User.find({"username": regex});
    console.log(listUser);
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            if (req.body.fileName) user.profilePicture = req.body.fileName;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                user.password = hashedPassword
            }
            await user.save();
            const updatedUser = await User.findOne({ username: req.params.username });
            res.status(200).json(updatedUser);
        }
        else
            res.status(404).json({ msg: 'user not found' })
    }
    catch (e) {
        console.log(e.message);
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
        const user = await User.aggregate([{
            $match: {
                _id: { $eq: mongoose.Types.ObjectId(req.params.id) }
            },

        }, {
            $unwind: '$searchFriend',
        }, {
            $lookup: {
                from: 'users',
                localField: 'friends',
                foreignField: '_id',
                as: 'friends'
            }
        }, {
            $group: {
                _id: '$_id',
                friends: {
                    $push: {
                        username: '$searchFriend.username',
                        email: '$searchFriend.email',
                        _id: '$searchFriend._id',
                    }
                }

            }
        }])
        res.status(200).json(user);
    } catch (e) {
        console.log(e.message);
        res.status(5000).json(e.message);
    }

}

exports.addFriend = async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const idFriend = req.body.idFriend;
        const user = await User.findOne({ _id: idUser });
        user.friends.push(idFriend);
        const friend = await User.findOne({ _id: idFriend });
        friend.friends.push(idUser);
        friend.save();
        user.save();
        res.status(200).json("add success");
    } catch (e) {
        res.status(500).json(e.message);
    }
}