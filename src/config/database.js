const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://arshad58:sMOhsiNZLzqSBRI4@devconnect.myyx2ze.mongodb.net/DevConnect');
};


module.exports = connectDB;