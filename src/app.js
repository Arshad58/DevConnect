const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User (req.body);
  try {
    const savedUser = await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("error while saving user"+error.message);
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




