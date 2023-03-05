const {getAllChatGroupByUserId, createChatGroup, addMessageToChatGroup} = require("../controllers/chatGroupController");
const router = require('express').Router();
router.get('/:id', getAllChatGroupByUserId);
router.post('/', createChatGroup);
router.post('/message', addMessageToChatGroup);
module.exports = router;