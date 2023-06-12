const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { createChatGroup } = require("./chatGroupController");
const ChatGroup = require('../models/ChatGroup');

exports.searchUser = async (req, res) => {
    try {
        const regex = new RegExp(req.query.q, "i"); //req.query.q =te
        const listUser = await User.find({
            $and: [
                { "username": regex },
                { "username": { $ne: req.body.username } }
            ]
        });
        const newListUser = JSON.parse(JSON.stringify(listUser));
        const user = await User.findOne({ "username": req.body.username });
        for (let i = 0; i < newListUser.length; i++) {
            newListUser[i].check = 0;
            for (let j = 0; j < user.friends.length; j++) {
                if (newListUser[i]._id == user.friends[j]) {
                    newListUser[i].check = 1;
                    break;
                }
            }
        }
        for (let i = 0; i < newListUser.length; i++) {
            for (let j = 0; j < user.listInvite.length; j++) {
                if (newListUser[i]._id == user.listInvite[j]) {
                    newListUser[i].check = 2;
                    break;
                }
            }
        }
        res.status(200).send(newListUser);
    }
    catch (e) {
        res.status(500).json(e.message);
    }
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

exports.removeFriendOfUser = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.body.idUser);
        const idFriend = mongoose.Types.ObjectId(req.body.idFriend);
        const user = await User.findOne({ _id: userId });
        const friend = await User.findOne({ _id: idFriend });
        ChatGroupToDelete = await ChatGroup.find({
            members: {$all: [userId, idFriend]},
            $expr: { $eq: [{ $size: "$members" }, 2] }
        });
        console.log(ChatGroupToDelete);
        const deleteResult = await ChatGroup.deleteMany({
            _id: {$in: ChatGroupToDelete.map(group => group._id)}
        })
        console.log(deleteResult);
        await User.updateOne(
            { _id: userId },
            { $pull: { friends: idFriend } },
            (err, result) => {
                if (err) {
                    console.log("Error:", err);
                } else {
                    console.log("Friend ID removed:", idFriend);
                }
            }
        );

        await User.updateOne(
            { _id: idFriend },
            { $pull: { friends: userId } },
            (err, result) => {
                if (err) {
                    console.log("Error:", err);
                } else {
                    console.log("Friend ID removed:", userId);
                }
            }
        );



        return res.status(200).json("Remove successs");
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json(e.message);

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
            $unwind: '$friends'
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
                        user: '$friends'
                    }
                }
            }
        }])
        res.status(200).json(user);
    } catch (e) {
        console.log(e.message);
        res.status(500).json(e.message);
    }

}

exports.addPending = async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const idFriend = req.body.idFriend;
        const user = await User.findOne({ _id: idUser });
        const friend = await User.findOne({ _id: idFriend });
        friend.listReceive.push(idUser);
        user.listInvite.push(idFriend);
        await user.save();
        await friend.save();
        res.status(200).json(user);
    }
    catch (e) {
        res.status(500).json(err.message);
    }
}

exports.removePending = async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const idFriend = req.body.idFriend;
        const user = await User.findOne({ _id: idUser });
        const friend = await User.findOne({ _id: idFriend });
        user.listInvite = user.listInvite.filter(item =>
            item != idFriend
        );
        friend.listReceive = friend.listReceive.filter(item => item != idUser)
        await user.save();
        await friend.save();

        res.status(200).json(user);
    }
    catch (e) {
        res.status(500).json(err.message);
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
        friend.listInvite = friend.listInvite.filter(item =>
            item != idUser
        );
        user.listReceive = user.listReceive.filter(item => item != idFriend)
        await user.save();
        await friend.save();
        res.status(200).json("add friend success");
    } catch (e) {
        res.status(500).json(e.message);
    }
}

exports.getListPending = async (req, res) => {
    try {
        const idUser = req.params.id;
        const listReceive = await User.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(idUser)
            }
        }, {
            $unwind: '$listReceive'
        }, {
            $lookup: {
                from: 'users',
                localField: 'listReceive',
                foreignField: '_id',
                as: 'listReceive'
            }
        }, {
            $group: {
                _id: '$_id',
                listReceive: {
                    $push: { user: '$listReceive' }
                },

            }
        },
        ])
        console.log(listReceive);
        res.status(200).json(listReceive);
    }
    catch (e) {
        res.status(500).json(e.message);
    }

}