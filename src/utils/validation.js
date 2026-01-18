const validator = require("validator");

const validateSignUpData = (req) => {
     const { firstName, lastName,email, password}= req.body;
        if (!firstName || firstName.length < 2 || firstName.length > 30) {
            throw new Error("First name is required and should be between 2 to 30 characters.");
        }
        else if (lastName && (lastName.length < 2 || lastName.length > 30)) {
            throw new Error("Last name should be between 2 to 30 characters.");
        }
        else if (!email || !validator.isEmail(email)) {
            throw new Error("A valid email is required.");
        }
        else if (!password || !validator.isStrongPassword(password)) {
            throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        }
};

module.exports = { 
    validateSignUpData 
}; 