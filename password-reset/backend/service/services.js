const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const sendMail = require("../service/sendMail");

async function forgotpassword(req, res) {
    const { email } = req.body;
    console.log(email);
    

    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
        return res.status(404).json({ message: "User not found", email });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    const website = process.env.WEBSITE;


    const resetLink = `${website}/reset-password/${token}`;
    console.log(resetLink);
    
    try {
        await sendMail(email, resetLink);
        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
}


async function register(req, res) {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
}


async function resetpassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Token invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


module.exports = {
    forgotpassword,
    register,
    resetpassword,
    login
}