const moongoose = require('mongoose');
const connectionRequestSchema = new moongoose.Schema({
    fromUserId: { 
        type: moongoose.Schema.Types.ObjectId,
        requrired: true
    },
    toUserId: { 
        type: moongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["ignored", "pending", "accepted", "rejected"],
            message: '{VALUE} is not status type'
        },
    },    
}, 
    {timestamps: true}
);

const ConnectionRequestModel = new moongoose.model(
    'ConnectionRequest', 
    connectionRequestSchema
);
module.exports = ConnectionRequestModel;