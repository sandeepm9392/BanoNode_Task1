const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const User_data = require("./model.js")
const app = express();
dotenv.config();
app.use(express.json());

const connect = () => {
    mongoose
        .connect(process.env.MONGO)
        .then(() => {
            console.log("Connected to DB");
        })
        .catch((err) => {
            throw err;
        });
};



//Register user

app.post('/api/user/register', async (req, res) => {
    try {
        const {  username,email, password } = req.body;        
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new User_data({ username,email, password: hashedPassword });

        await user.save();

        res.status(200).json({ message: 'User has been registered successfully', user_id: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//login user
app.post('/api/user/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User_data.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Password incorrect please check' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT);
        res.status(200).json({ 
            message: `Login successful welcome  ${username}!`, 
            user_id: user._id, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//forgot password
app.post('/api/user/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body;

        res.status(200).json({ message: `Password reset link is sent to Registered email :${email}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(8000, () => {
    connect();
    console.log("server listening at port 8000.....")
})