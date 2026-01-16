const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post("/signup", async (req, res) => {
  const user = new User ({ 
    firstName: "user1",
    lastName: "user1lastname",
    email: "user1@example.com",
    password: "user123",
  });
  try {
    const savedUser = await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("error while saving user"+error.message);
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




