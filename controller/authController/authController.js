const User = require('../../model/user/userModel');
const Coach = require('../../model/coach/coachModel');
const Player = require('../../model/player/playerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, Email, and Password are required.' });
        }

        const userRole = role ? role.toLowerCase() : 'player';

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.', data: null });
        }

        const pass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: pass,
            role: userRole,
            status: status || 'active'
        });

if (userRole === 'coach') {
            await Coach.create({ userId: user._id, specialization: 'General', qualification: 'Certified', experience: 1 });
        } else if (userRole === 'player') {
            await Player.create({ userId: user._id, age: 18, gender: 'Other', sportPreference: 'General', experienceLevel: 'Beginner' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'sports_academy_secret_key_2026',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'User Registered.',
            token,
            data: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Error Registering User.', error: error.message });
    }
};

const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log('User Not Found.');
            return res.status(404).json({ message: 'User Not Found.', data: null });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Account is Inactive. Please contact Admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password Is Not Match.');
            return res.status(401).json({ message: 'Password Not Match.', data: null });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'sports_academy_secret_key_2026',
            { expiresIn: '7d' }
        );

        console.log('User Login successfully.', user);

        return res.status(200).json({
            message: 'User Login Successfully.',
            token,
            data: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
        });

    } catch (error) {
        console.log('Error While Login User.', error);
        return res.status(500).json({ message: 'Error While Login User.', error: error.message });
    }
};

const fetchingAuthController = async (req, res) => {
    try {
        const user = await User.find().select('-password');

        if (!user || user.length === 0) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching successfully.', user);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: user });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const fetchingSingelAuthController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching successfully.', user);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: user });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const editAuthController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, status } = req.body;

        let updateData = { name, email, role, status };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('User Edit successfully.', user);
        return res.status(200).json({ message: 'User Edit Successfully.', data: user });

    } catch (error) {
        console.log('Error While Editing User.', error);
        return res.status(500).json({ message: 'Error While Editing User.', error: error.message });
    }
};

const getMeController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        let profile = null;

        if (user.role === 'coach') {
            profile = await Coach.findOne({ userId: user._id });
        } else if (user.role === 'player') {
            profile = await Player.findOne({ userId: user._id });
        }

        return res.status(200).json({ message: 'Profile Retrieved.', user, profile });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Profile.', error: error.message });
    }
};

module.exports = {registerController,loginUserController,fetchingAuthController,fetchingSingelAuthController,editAuthController,getMeControlle};
