const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bycrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth");



app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const{firstName, lastName, email, password} = req.body;
  const passwordHash = await bycrypt.hash(password, 10);
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



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required for login.");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);
    if (isPasswordValid) {

      const token = await jwt.sign({ _id: user._id }, "devsecretkey");

      res.cookie("token", token);
      res.send("User logged in successfully");
      
    }else {

      throw new Error("Invalid credentials.");
    }
  }
  catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});  

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});



app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ['firstName', 'lastName', 'email', 'password', 'age', 'gender', 'photourl', 'skills'];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("invalid updates!");
    }
    if(data?.skills?.length > 10){
      throw new Error("skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      data,
      {
        new: true,           
        runValidators: true,
        // timestamps: true,
        context: 'query',
      }
    );  
    if(data?.email){
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new Error("Email already in use by another account.");
        }
    }

    console.log(user);
    res.send("user updated successfully");
  } 
  catch (error) {
    res.status(400).send("error while updating user " + error.message);
  }
});



connectDB()
.then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

})
.catch(err => {
    console.error('Database connection error:', err);
}); 




