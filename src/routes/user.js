const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { message } = require("statuses");

const USER_DATA = "firstName lastName photourl skills about age";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const conectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);
    res.json({
      message: "Connection requests received by " + req.user.firstName,
      data: conectionRequests,
    });
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id, status: "accepted" },
        { toUserId: loggedInUserId._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    const hiddenUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenUserFromFeed.add(req.fromUserId.toString());
      hiddenUserFromFeed.add(req.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUserFromFeed) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    res.send({ data: feedUsers });
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
