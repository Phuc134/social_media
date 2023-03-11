const Message = require('../models/Message');
const ChatGroup = require('../models/ChatGroup');
const mongoose = require("mongoose");
exports.createChatGroup = async (req, res) => {
    try {
        const newChatGroup = new ChatGroup({
            members: req.body.members,
            initiator: req.body.initiator,
            type: req.body.type,
        })
        await newChatGroup.save();
        res.status(200).json('create success');
    } catch (e) {
        res.status(500).json(e.message);
    }
}

exports.addMessageToChatGroup = async (req, res) => {
    try {
        const newMessage = new Message({
            chatGroupId: req.body.chatGroupId,
            authorId: req.body.authorId,
            text: req.body.text,
        })
        await newMessage.save();
        res.status(200).json('create message success');
    } catch (e) {
        res.status(500).json(e.message);
    }
}

exports.getAllChatGroupByUserId = async (req, res) => {
    try {
        const idUser = (req.params.id); // convert to number
        console.log(idUser);
        const listChatGroup = await ChatGroup.aggregate([
            {
                $match: {
                    members: {
                        $in: [mongoose.Types.ObjectId(idUser)]
                    }
                },

            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "chatGroupId",
                    as: "chatGroup",
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'initiator',
                    foreignField: '_id',
                    as: 'test'
                }
            },
            {
                $addFields: {
                    lastestMessage: {$max: "$chatGroup.createdAt"}
                }
            },
            {
                $sort: {lastestMessage: -1}
            },
            {
                $unwind: '$chatGroup'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'chatGroup.authorId',
                    foreignField: '_id',
                    as: 'chatGroup.authorId'
                }
            },
            {
                $group: {
                    _id: '$chatGroup.chatGroupId',
                    messages: {
                        $push: {
                            text: '$chatGroup.text',
                            user: '$chatGroup.authorId'
                        }
                    },
                    initiator: {
                        $first: '$initiator',
                    },
                    name: {
                        $first: '$name'
                    },
                    createdAt: {
                        $first: '$createdAt'
                    }

                }
            },
            {
                $project: {
                    _id: 1,
                    'initiator': 1,
                    'name': 1,
                    'createdAt': 1,
                    'messages.text': 1,
                    'messages.user.id': 1,
                    'messages.user.profilePicture': 1,
                    'messages.user.email': 1,
                    'messages.user.username': 1
                }
            }

        ])
        res.status(200).json(listChatGroup);
    } catch (e) {
        res.status(500).json(e.message)
    }
}