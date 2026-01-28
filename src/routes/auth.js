const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  const{firstName, lastName, email, password} = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User ({
    firstName,
    lastName,
    email,
    password: passwordHash
  });

  try {
    validateSignUpData(req);
    const savedUser = await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("ERROR"+error.message);
  }
});



authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required for login.");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {

      const token = await user.getJWT();

      res.cookie("token", token,{ 
        expires: new Date(Date.now() + 8 * 3600000),
    });
      res.send("User logged in successfully");
      
    }else {

      throw new Error("Invalid credentials.");
    }
  }
  catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});


module.exports = authRouter;