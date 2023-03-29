const Message = require('../models/Message');
const ChatGroup = require('../models/ChatGroup');
const mongoose = require("mongoose");
const User = require('../models/User');
const _ = require('lodash');
exports.test = async (req, res) => {
    try {
        const idUser = (req.params.id);
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
                $addFields: {
                    lastestMessage: { $max: "$chatGroup.createdAt" }
                }
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
                    members: {
                        $first: '$members',
                    },
                    initiator: {
                        $first: '$initiator',
                    },
                    name: {
                        $first: '$name'
                    },
                    lastestMessage: {
                        $first: '$lastestMessage'
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
                    'members': 1,
                    'createdAt': 1,
                    'messages.text': 1,
                    'messages.user._id': 1,
                    'messages.user.profilePicture': 1,
                    'messages.user.email': 1,
                    'lastestMessage': 1,
                    'messages.user.username': 1
                }
            },
            {
                $sort: { lastestMessage: -1 }
            },
        ]);
        const update = await ChatGroup.aggregate([
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
            }]);
        for (let i = 0; i < update.length; i++) {
            if (update[i].chatGroup.length == 0) {
                update[i].messages = [];
                listChatGroup.unshift(update[i]);
            }
        }
        res.status(200).json({ listChatGroup });
    }
    catch (err) {
        res.status(500).json(err.message);

    }

}
exports.createChatGroup = async (req, res) => {
    try {
        console.log(req.body.fileName);
        const newChatGroup = new ChatGroup({
            members: req.body.members,
            initiator: req.body.initiator,
            name: req.body.name,
            imgChatGroup: req.body.fileName,
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
            imgChatGroup: req.body.fileName,
        })
        await newMessage.save();
        res.status(200).json('create message success');
    } catch (e) {
        res.status(500).json(e.message);
    }
}

exports.getAllChatGroupByGroupId = async (req, res) => {
    try {
        const idUser = (req.params.id);
        const idGroupId = (req.params.groupId);
        const chatGroup = await ChatGroup.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(idGroupId)
                }
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
                    members: {
                        $first: '$members'
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
                    'members': 1,
                    'name': 1,
                    'createdAt': 1,
                    'messages.text': 1,
                    'messages.user._id': 1,
                    'messages.user.profilePicture': 1,
                    'messages.user.email': 1,
                    'messages.user.username': 1
                }
            }
        ]);
        let newChatGroup;
        if (chatGroup.length==0) {
            const temp = await ChatGroup.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(idGroupId)
                    }
                },
                {
                    $lookup: {
                        from: "messages",
                        localField: "_id",
                        foreignField: "chatGroupId",
                        as: "chatGroup",
                    },
                },
                ])
            newChatGroup = _.cloneDeep(temp);
            newChatGroup[0].messages = [];
        }
        else newChatGroup =_.cloneDeep(chatGroup);
        if (newChatGroup[0].members.length == 2) {
            if (newChatGroup[0].members[0]==idUser)
                newChatGroup[0].user = await  User.findById(newChatGroup[0].members[1]);
            else newChatGroup[0].user = await  User.findById(newChatGroup[0].members[0]);
        }
        res.status(200).json(newChatGroup);
    } catch (e) {
        res.status(500).json(e.message);
    }
}

exports.getAllChatGroupByUserId = async (req, res) => {
    try {
        const idUser = (req.params.id);
        let newListChatGroup = await ChatGroup.aggregate([
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
    ])
        for (let i = 0; i < newListChatGroup.length; i++) {
            if (newListChatGroup[i].initiator == null) {
                const id = (req.params.id == newListChatGroup[i].members[0]) ?
                    newListChatGroup[i].members[1] : newListChatGroup[i].members[0]
                newListChatGroup[i].user = await User.findById(id);
            }
        }

        res.status(200).json(newListChatGroup);
    } catch (e) {
        res.status(500).json(e.message)
    }
}