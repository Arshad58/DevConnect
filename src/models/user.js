const mongoose = require("mongoose");
const { match } = require("type-is");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: true,
        minlenght: 2,
        maxlength: 30
    },
    lastName: { 
        type: String,
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email format"+  value);
            }
    },
},
    password: { 
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Use a strong password it should contain at least 8 characters, one uppercase, one lowercase, one number and one symbol"+ value);
            }
    },
    },
    age : { 
        type: Number,
    },
    gender: { 
        type: String,
        validate(value) {
            const allowedGenders = ['male', 'female', 'other'];
            if (value && !allowedGenders.includes(value.toLowerCase())) {
                throw new Error('Gender must be male, female, or other');
            }
        },
    },
    photourl: { 
        type: String,
        default: "https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-gray-placeholder-vector-png-image_16213764.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL format"+ value);
            }
    },
    },
    skills: { 
        type: [String],
    }

},
{
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);