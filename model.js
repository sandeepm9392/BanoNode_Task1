const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

const User_data = mongoose.model("User_data", UserSchema);

module.exports = User_data;