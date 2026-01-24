const jwt = require ("jsonwebtoken");
const User = require("../modules/user");

const userAuth = async (req, res, next) => {

    try {
        const {token} = req.cookies;

    const decoded = await jwt.verify(token, "devsecretkey");

    const { _id } = decodedObj;
    
    const user = await User.findByID(_id);
    
    if(!user){
        throw new Error("User Not Found");
    }
    req.user = user;
    next();
}
catch(err){
    res.status(400).send("Error:" + err.message)
}

};

module.export = {
    userAuth,
};