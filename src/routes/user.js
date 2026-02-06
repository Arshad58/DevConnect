const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { message } = require("statuses");


const USER_DATA = "firstName lastName photoUrl skills about age";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {

    try{

        const loggedInUserId = req.user;

        const conectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId._id,
            status: "interested",
        }).populate(
            "fromUserId",
             USER_DATA
        );
        res.json({
            message: "Connection requests received by " + req.user.firstName,
            data: conectionRequests
        });

    }catch(err){
        return res.status(400).send("ERROR: " + err.message);  
    }




});

userRouter.get("/user/requests/sent", userAuth, async (req, res) => {

    try{
        const loggedInUserId = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId._id, status: "accepted" },
                { toUserId: loggedInUserId._id, status: "accepted" },
            ],
        }).populate("toUserId", USER_DATA);
    }
    catch(err){
        return res.status(400).send("ERROR: " + err.message);
    };
});

module.exports = userRouter;