const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const userController = require('../controllers/usersController')
const { verifyAccessToken } = require("../middlewares/auth");
router.get("/test", verifyAccessToken, (req, res) => {
    console.log(req.user);
    return res.status(200).json("success");
})
router.get('/', async (req, res) => {
    const listUser = await User.find({});
    res.status(200).json(listUser);
})
//get list search
router.post("/search", userController.searchUser)
//update user 
router.put('/update/:username', userController.updateUser)
//add friend
router.post('/friend', userController.addFriend);
//get pending
router.get('/get-pending/:id', userController.getListPending);
//add pending
router.post('/pending', userController.addPending);
//remove pending
router.post('/remove-pending', userController.removePending);
//update user
router.put("/:id", userController.updateUser);
//delete user
router.delete("/:id", userController.deleteUser);
//get a user
router.get("/:id", userController.getUserById);
//get searchFriend
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
