const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        unique: true,
    },
    googleId:{
        type: String,
        required: false,
        sparse:true, // This allows for multiple users with the same email but different Google IDs
    },
},{
    timestamps: true,
    versionKey: false,
});



const UserModel = mongoose.model('user', userSchema);

module.exports = {UserModel};