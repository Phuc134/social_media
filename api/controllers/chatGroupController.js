const Message = require('../models/Message');
const ChatGroup = require('../models/ChatGroup');
const mongoose = require("mongoose");
const User = require('../models/User');
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
        console.log('day la update', update);
        res.status(200).json({ listChatGroup });
    }
    catch (err) {
        res.status(500).json(err.message);

    }

}
exports.createChatGroup = async (req, res) => {
    try {
        const newChatGroup = new ChatGroup({
            members: req.body.members,
            initiator: req.body.initiator,
            name: req.body.name
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

exports.getAllChatGroupByGroupId = async (req, res) => {
    try {
        const idUser = (req.params.id);
        const idGroupId = (req.params.groupId);
        let chatGroup = await ChatGroup.aggregate([
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

        if (chatGroup.length == 0) {
            chatGroup = await ChatGroup.find({ "_id": idGroupId });
            chatGroup[0].messages = [];

        }
        res.status(200).json(chatGroup);
    } catch (e) {
        res.status(500).json(e.message);
    }
}

exports.getAllChatGroupByUserId = async (req, res) => {
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
        for (let i = 0; i < listChatGroup.length; i++) {
            if (listChatGroup[i].initiator == null) {
                const id = (req.params.id == listChatGroup[i].members[0]) ?
                    listChatGroup[i].members[1] : listChatGroup[i].members[0]
                listChatGroup[i].user = await User.findById(id);
            }
        }
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
                listChatGroup.push(update[i]);
            }
        }
        res.status(200).json(listChatGroup);
    } catch (e) {
        res.status(500).json(e.message)
    }
}