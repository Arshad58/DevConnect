const mongoose = require("mongoose");
const { match } = require("type-is");

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: true,
        minlenghth: 2,
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
        trim: true
    },
    password: { 
        type: String,
        required: true,
        minlength: 6,
        match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
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
        default: 'https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-gray-placeholder-vector-png-image_16213764.png'
    },
    skills: { 
        type: [String],
    }

},
{
    timestamps: true 
});
module.exports = mongoose.model('User', userSchema);