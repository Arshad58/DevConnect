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
app.patch("/user", async (req, res) => {
  const { userId, ...data } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      data,
      {
        new: true,           
        runValidators: true, 
      }
    );

    console.log(user);
    res.send("user updated successfully");
  } catch (error) {
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




