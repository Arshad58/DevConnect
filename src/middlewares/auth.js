const jwt = require ("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

    try {
        const {token} = req.cookies;

    const decoded = await jwt.verify(token, "devsecretkey");

    const { _id } = decoded;
    
    const user = await User.findById(_id);
    
    if(!user){
        throw new Error("User Not Found");
    }
    req.user = user;
    next();
}
catch(err){
    res.status(400).send("ERROR: "+ err.message);
}

};

module.exports = {
    userAuth,
};