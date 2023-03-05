const ChatRoomModel = require('../models/ChatGroup');
const makeValidation = require('@withvoid/make-validation');
exports.initiate = async (req, res) => {
    try {
        const validator = makeValidation(types => ({
            payload: req.body,
            checks: {
                userIds: {
                    type: types.array,
                    options: {unique: true, empty: false, stringOnly: true}
                },
                type: {type: types.enum, options: {enum: CHAT_ROOM_TYPES}}
            }
        }));
        if (!validator.success) return res.status(400).json({...validation});
        const {userIds, type} = req.body;
        const {userId: chatInitiator} = req;
        const allUserIds = [...userIds, chatInitiator];
        const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
        return res.status(200).json({success: true, chatRoom});
    } catch (error) {
        return res.status(500).json({success: false, error: error})
    }

}