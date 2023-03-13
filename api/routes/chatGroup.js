const {
    getAllChatGroupByUserId,
    createChatGroup,
    addMessageToChatGroup,
    getAllChatGroupByGroupId
} = require("../controllers/chatGroupController");
const router = require('express').Router();
router.get('/:id', getAllChatGroupByUserId);
router.get('/:id/:groupId', getAllChatGroupByGroupId);
router.post('/', createChatGroup);
router.post('/message', addMessageToChatGroup);
module.exports = router;