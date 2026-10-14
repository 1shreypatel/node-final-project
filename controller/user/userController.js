const User = require('../../model/user/userModel');
const Coach = require('../../model/coach/coachModel');
const Player = require('../../model/player/playerModel');
const bcrypt = require('bcrypt');

const registerUserController = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;

        const pass = password ? await bcrypt.hash(password, 10) : '';

        const user = await User.create({
            name, email, password: pass, role: role || 'player', status: status || 'active'
        });

        return res.status(200).json({ message: 'User registered successfully', data: user });

    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const fetchingUserController = async (req, res) => {
    try {
        const user = await User.find().select('-password');
        return res.status(200).json({ message: 'User Fetching Successfully.', count: user.length, data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching User.', error: error.message });
    }
};

const fetchingSingelUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.', data: null });
        }
        return res.status(200).json({ message: 'User Fetching Successfully.', data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching User.', error: error.message });
    }
};

const editUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, status } = req.body;

        let updateData = { name, email, role, status };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        return res.status(200).json({ message: 'User Edit Successfully.', data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Error While Editing User.', error: error.message });
    }
};

const getAllUsersController = fetchingUserController; 

const updateUserStatusController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'active' or 'inactive'." });
        }

        const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User Not Found.' });

        return res.status(200).json({ message: `User status updated to ${status}.`, data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Error Updating Status.', error: error.message });
    }
};

const updateUserRoleController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'coach', 'player'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'admin', 'coach', or 'player'." });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User Not Found.' });

        return res.status(200).json({ message: `User role updated to ${role}.`, data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Error Updating Role.', error: error.message });
    }
};

const deleteUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: 'User Not Found.' });

        if (user.role === 'coach') await Coach.deleteOne({ userId });
        if (user.role === 'player') await Player.deleteOne({ userId });

        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error Deleting User.', error: error.message });
    }
};

module.exports = {registerUserController,fetchingUserController,fetchingSingelUserController,editUserController,getAllUsersController,updateUserStatusController,updateUserRoleController,};
