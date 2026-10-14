const Coach = require('../../model/coach/coachModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerCoachController = async (req, res) => {
    try {
        const { userId, specialization, qualification, experience, bio, profileimage } = req.body;

        const coach = await Coach.create({
            userId,
            specialization,
            qualification,
            experience,
            bio,
            profileimage
        });

        console.log('Coach Register Successfully.', coach);
        return res.status(201).json({ message: 'Coach Register Successfully.', data: coach });

    } catch (error) {
        console.log('Error While Register Coach.', error);
        return res.status(500).json({ message: 'Error While Register Coach.', error: error.message });
    }
};

const loginCoachController = async (req, res) => {
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
        console.log('Error While Login Coach.', error);
        return res.status(500).json({ message: 'Error While Login Coach.', error: error.message });
    }
};

const fetchingCoachController = async (req, res) => {
    try {
        const coach = await Coach.find().populate('userId', 'name email status');

        if (!coach || coach.length === 0) {
            console.log('Coach not found.');
            return res.status(404).json({ message: 'Coach not found.', data: null });
        }

        console.log('Coach Fetching Successfully.', coach);
        return res.status(200).json({ message: 'Coach Fetching Successfully.', data: coach });

    } catch (error) {
        console.log('Error While Fetching Coach.', error);
        return res.status(500).json({ message: 'Error While Fetching Coach.', error: error.message });
    }
};

const fetchingSingelCoachController = async (req, res) => {
    try {
        const { id } = req.params;
        const coach = await Coach.findById(id).populate('userId', 'name email status');

        if (!coach) {
            console.log('Coach not found.');
            return res.status(404).json({ message: 'Coach not found.', data: null });
        }

        console.log('Coach Fetching successfully.', coach);
        return res.status(200).json({ message: 'Coach Fetching Successfully.', data: coach });

    } catch (error) {
        console.log('Error While Fetching Coach.', error);
        return res.status(500).json({ message: 'Error While Fetching Coach.', error: error.message });
    }
};

const editCoachController = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, specialization, qualification, experience, bio, profileimage } = req.body;

        const coach = await Coach.findByIdAndUpdate(id, {
            userId, specialization, qualification, experience, bio, profileimage
        }, {
            new: true,
            runValidators: true
        });

        if (!coach) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('Coach Edit successfully.', coach);
        return res.status(200).json({ message: 'Coach Edit Successfully.', data: coach });

    } catch (error) {
        console.log('Error While Editing Coach.', error);
        return res.status(500).json({ message: 'Error While Editing Coach.', error: error.message });
    }
};

const upsertCoachProfileController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { specialization, qualification, experience, bio } = req.body;
        let profileimage = req.body.profileimage;

        if (req.file) {
            profileimage = `/uploads/${req.file.filename}`;
        }

        const updateData = { specialization, qualification, experience, bio };
        if (profileimage) {
            updateData.profileimage = profileimage;
        }

        const coachProfile = await Coach.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ message: 'Coach Profile Saved Successfully.', data: coachProfile });
    } catch (error) {
        return res.status(500).json({ message: 'Error Saving Coach Profile.', error: error.message });
    }
};

const getMyCoachProfileController = async (req, res) => {
    try {
        const userId = req.user._id;
        const coachProfile = await Coach.findOne({ userId }).populate('userId', 'name email status');

        if (!coachProfile) return res.status(404).json({ message: 'Coach Profile Not Found.' });
        return res.status(200).json({ message: 'Coach Profile Retrieved.', data: coachProfile });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Profile.', error: error.message });
    }
};

const getCoachProfileByIdController = fetchingSingelCoachController;

module.exports = {registerCoachController,loginCoachController,fetchingCoachController,fetchingSingelCoachController,editCoachController,upsertCoachProfileController,getMyCoachProfileController,getCoachProfileByIdControlle};
