const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const sendEmail = require('../utils/sendEmail');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Master Admin Credentials Bypass & Dynamic Creation
        if ((email === 'phulkeshwar' || email === 'phulkeshwarmahto9@gmail.com') && password === 'phulkeshwar@828403') {
            let adminUser = await User.findOne({ email: 'phulkeshwarmahto9@gmail.com' });
            if (!adminUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('phulkeshwar@828403', salt);
                adminUser = await User.create({
                    name: 'Phulkeshwar Mahto',
                    email: 'phulkeshwarmahto9@gmail.com',
                    password: hashedPassword,
                    role: 'admin',
                    isVerified: true
                });
            }
            return res.json({
                _id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                token: generateToken(adminUser._id),
            });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Check if verified
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires
        });

        if (user) {
            // Send Email
            const message = `Your verification code is: ${otp}`;
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Verify your email',
                    message,
                });

                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    message: 'Registered! Please check your email for OTP.',
                });
            } catch (error) {
                // If email fails, delete user so they can try again? Or just return error?
                // For now simplicity:
                console.log(error);
                res.status(500).json({ message: 'Email could not be sent' });
            }

        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: 'Email verified successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const message = `Your password reset code is: ${otp}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Code',
                message,
            });
            res.json({ message: 'OTP sent to email' });
        } catch (error) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp === otp && user.otpExpires > Date.now()) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({ message: 'Password reset successful' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const message = `Your new verification code is: ${otp}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your email (Resend)',
                message,
            });

            res.json({ message: 'New OTP sent to email' });
        } catch (error) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = { loginUser, registerUser, verifyEmail, forgotPassword, resetPassword, resendOTP };
