const Player = require('../../model/player/playerModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerPlayerController = async (req, res) => {
    try {
        const { userId, age, gender, sportPreference, experienceLevel, profileimage } = req.body;

        const player = await Player.create({
            userId,
            age,
            gender,
            sportPreference,
            experienceLevel,
            profileimage,
        });

        console.log('Player Successfully.', player);
        return res.status(201).json({ message: 'Player Successfully.', data: player });

    } catch (error) {
        console.log('Error While Register Player.', error);
        return res.status(500).json({ message: 'Error While Register Player.', error: error.message });
    }
};

const loginPlayerController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User Not Found.');
            return res.status(404).json({ message: 'User Not Found.', data: null });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password Is Not Match.');
            return res.status(401).json({ message: 'Password Not Match.', data: null });
        }

        console.log('User Login Successfully.', user);
        return res.status(200).json({ message: 'User Login Successfully.', data: user });

    } catch (error) {
        console.log('Error While Login Player.', error);
        return res.status(500).json({ message: 'Error While Login Player.', error: error.message });
    }
};

const fetchingPlayerController = async (req, res) => {
    try {
        const player = await Player.find().populate('userId', 'name email status');

        if (!player || player.length === 0) {
            console.log('Player not found.');
            return res.status(404).json({ message: 'Player not found.', data: null });
        }

        console.log('Player Fetching Successfully.', player);
        return res.status(200).json({ message: 'Player Fetching Successfully.', data: player });

    } catch (error) {
        console.log('Error While Fetching Player.', error);
        return res.status(500).json({ message: 'Error While Fetching Player.', error: error.message });
    }
};

const fetchingSingelPlayerController = async (req, res) => {
    try {
        const { id } = req.params;

        const player = await Player.findById(id).populate('userId', 'name email status');

        if (!player) {
            console.log('Player not found.');
            return res.status(404).json({ message: 'Player not found.', data: null });
        }

        console.log('Player Fetching successfully.', player);
        return res.status(200).json({ message: 'Player Fetching Successfully.', data: player });

    } catch (error) {
        console.log('Error While Fetching Player.', error);
        return res.status(500).json({ message: 'Error While Fetching Player.', error: error.message });
    }
};

const editPlayerController = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, age, gender, sportPreference, experienceLevel, profileimage } = req.body;

        const player = await Player.findByIdAndUpdate(id, {
            userId, age, gender, sportPreference, experienceLevel, profileimage
        }, {
            new: true,
            runValidators: true
        });

        if (!player) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('Player Edit successfully.', player);
        return res.status(200).json({ message: 'Player Edit Successfully.', data: player });

    } catch (error) {
        console.log('Error While Editing Player.', error);
        return res.status(500).json({ message: 'Error While Editing Player.', error: error.message });
    }
};

const upsertPlayerProfileController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { age, gender, sportPreference, experienceLevel } = req.body;
        let profileimage = req.body.profileimage;

        if (req.file) {
            profileimage = `/uploads/${req.file.filename}`;
        }

        const updateData = { age, gender, sportPreference, experienceLevel };
        if (profileimage) {
            updateData.profileimage = profileimage;
        }

        const playerProfile = await Player.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ message: 'Player Profile Saved Successfully.', data: playerProfile });
    } catch (error) {
        return res.status(500).json({ message: 'Error Saving Player Profile.', error: error.message });
    }
};

const getMyPlayerProfileController = async (req, res) => {
    try {
        const userId = req.user._id;
        const playerProfile = await Player.findOne({ userId }).populate('userId', 'name email status');

        if (!playerProfile) return res.status(404).json({ message: 'Player Profile Not Found.' });
        return res.status(200).json({ message: 'Player Profile Retrieved.', data: playerProfile });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Profile.', error: error.message });
    }
};

module.exports = {registerPlayerController,loginPlayerController,fetchingPlayerController,fetchingSingelPlayerController,editPlayerController,upsertPlayerProfileController,getMyPlayerProfileControlle};
