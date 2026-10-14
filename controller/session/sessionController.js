const SessionProgress = require('../../model/session/sessionModel');
const Enrollment = require('../../model/enrollment/enrollmentModel');
const TrainingSession = require('../../model/training/trainingModel');
const TrainingProgram = require('../../model/trainingProgram/trainingProgramModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerSessionController = async (req, res) => {
    try {
        const { enrollmentId, sessionId, completed } = req.body;

        const session = await SessionProgress.create({
            playerId: req.user?._id,
            programId: req.body.programId,
            sessionId,
            completed: completed || false,
            completedAt: completed ? new Date() : null
        });

        console.log('Session Successfully.', session);
        return res.status(201).json({ message: 'Session Successfully.', data: session });

    } catch (error) {
        console.log('Error While Register Session.', error);
        return res.status(500).json({ message: 'Error While Register Session.', error: error.message });
    }
};

const loginSessionController = async (req, res) => {
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
        console.log('Error While Login Session.', error);
        return res.status(500).json({ message: 'Error While Login Session.', error: error.message });
    }
};

const fetchingSessionController = async (req, res) => {
    try {
        const session = await SessionProgress.find().populate('playerId', 'name email').populate('sessionId', 'title');

        if (!session || session.length === 0) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching Successfully.', session);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: session });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const fetchingSingelSessionController = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await SessionProgress.findById(id).populate('playerId', 'name email').populate('sessionId', 'title');

        if (!session) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching successfully.', session);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: session });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const editSessionController = async (req, res) => {
    try {
        const { id } = req.params;
        const { enrollmentId, sessionId, completed } = req.body;

        const session = await SessionProgress.findByIdAndUpdate(id, {
            sessionId, completed, completedAt: completed ? new Date() : null
        }, {
            new: true,
            runValidators: true
        });

        if (!session) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('User Edit successfully.', session);
        return res.status(200).json({ message: 'User Edit Successfully.', data: session });

    } catch (error) {
        console.log('Error While Editing User.', error);
        return res.status(500).json({ message: 'Error While Editing User.', error: error.message });
    }
};

const toggleSessionProgressController = async (req, res) => {
    try {
        const playerId = req.user._id;
        const { programId, sessionId, completed } = req.body;

        const isCompleted = completed !== undefined ? Boolean(completed) : true;

        const progress = await SessionProgress.findOneAndUpdate(
            { playerId, programId, sessionId },
            { completed: isCompleted, completedAt: isCompleted ? new Date() : null },
            { new: true, upsert: true }
        );

        const totalSessions = await TrainingSession.countDocuments({ programId });
        const completedCount = await SessionProgress.countDocuments({ playerId, programId, completed: true });
        const progressPercentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

        return res.status(200).json({
            message: `Session marked as ${isCompleted ? 'Completed' : 'Incomplete'}.`,
            data: { progress, completedSessionsCount: completedCount, totalSessionsCount: totalSessions, progressPercentage }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error Updating Progress.', error: error.message });
    }
};

const getPlayerProgramProgressController = async (req, res) => {
    try {
        const playerId = req.user._id;
        const { programId } = req.params;

        const totalSessions = await TrainingSession.countDocuments({ programId });
        const sessionProgresses = await SessionProgress.find({ playerId, programId });
        const completedCount = sessionProgresses.filter(p => p.completed).length;
        const progressPercentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

        return res.status(200).json({
            message: 'Player Progress Retrieved.',
            data: { programId, completedSessionsCount: completedCount, totalSessionsCount: totalSessions, progressPercentage, sessionProgresses }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Progress.', error: error.message });
    }
};

module.exports = {registerSessionController,loginSessionController,fetchingSessionController,fetchingSingelSessionController,editSessionController,toggleSessionProgressController,getPlayerProgramProgressControlle};
