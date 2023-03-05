const router = require("express").Router();
const Conversation = require("../models/Message");
const User = require("../models/User");
const {raw} = require("express");
//Get conversation by id
router.get("/:id", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({"_id": req.params.id});
        res.status(200).json(conversation);
    } catch (e) {
        res.status(500).json(e);

    }
})
//get list conversation by User
router.get("/user/:id", async (req, res) => {
    try {
        const listConversation = await Conversation.find({"members.id": {$in: [req.params.id]}});
        res.status(200).json(await Promise.all(listConversation.map(async (item) => {
            let user = null;
            console.log(item.members.length);
            if (item.members.length < 3) {
                const id = item.members[0].id == req.params.id ? item.members[1].id : item.members[0].id;
                user = await User.findOne({"_id": id});
            }
            return {
                idConversation: item._id,
                message: item.message,
                members: item.members,
                user: user
            }
        })));
    } catch (e) {
        res.status(500).json(e);
    }
})

//create Conversation when add friend
router.post("/", async (req, res) => {
    try {
        const newConversation = new Conversation({
            members: req.body.members,
        })
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (e) {
        res.status(500).json(e);
    }
})

//create message with conversationID
router.post("/message/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const conversation = await Conversation.findOne({"_id": req.params.id});
        conversation.message.push({
            sender: req.body.sender,
            text: req.body.text
        })
        await conversation.save();
        res.json("success");
    } catch (e) {
        res.status(500).json(e);

    }
})
module.exports = router;