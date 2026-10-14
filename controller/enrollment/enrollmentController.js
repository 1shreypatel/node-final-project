const Enrollment = require('../../model/enrollment/enrollmentModel');
const TrainingProgram = require('../../model/trainingProgram/trainingProgramModel');
const SessionProgress = require('../../model/session/sessionModel');
const TrainingSession = require('../../model/training/trainingModel');
const Player = require('../../model/player/playerModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerEnrollmentController = async (req, res) => {
    try {
        const { playerId, programId, enrollmentType, status, joinedAt } = req.body;

        const enrollment = await Enrollment.create({
            playerId: playerId || req.user?._id,
            programId,
            enrollmentType: enrollmentType || 'free',
            paymentStatus: enrollmentType === 'paid' ? 'pending' : 'completed',
            status: status || 'active',
            joinedAt
        });

        console.log('Enrollment Successfully.', enrollment);
        return res.status(201).json({ message: 'Enrollment Successfully.', data: enrollment });

    } catch (error) {
        console.log('Error While Register Enrollment.', error);
        return res.status(500).json({ message: 'Error While Register Enrollment.', error: error.message });
    }
};

const loginEnrollmentController = async (req, res) => {
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
        console.log('Error While Login Enrollment.', error);
        return res.status(500).json({ message: 'Error While Login Enrollment.', error: error.message });
    }
};

const fetchingEnrollmentController = async (req, res) => {
    try {
        const enrollment = await Enrollment.find().populate('playerId', 'name email').populate('programId', 'name');

        if (!enrollment || enrollment.length === 0) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching Successfully.', enrollment);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: enrollment });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const fetchingSingelEnrollmentController = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findById(id).populate('playerId', 'name email').populate('programId', 'name');

        if (!enrollment) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching successfully.', enrollment);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: enrollment });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const editEnrollmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId, programId, enrollmentType, status, joinedAt } = req.body;

        const enrollment = await Enrollment.findByIdAndUpdate(id, {
            playerId, programId, enrollmentType, status, joinedAt
        }, {
            new: true,
            runValidators: true
        });

        if (!enrollment) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('User Edit successfully.', enrollment);
        return res.status(200).json({ message: 'User Edit Successfully.', data: enrollment });

    } catch (error) {
        console.log('Error While Editing User.', error);
        return res.status(500).json({ message: 'Error While Editing User.', error: error.message });
    }
};

const joinFreeProgramController = async (req, res) => {
    req.body.enrollmentType = 'free';
    return registerEnrollmentController(req, res);
};

const initiatePaidEnrollmentController = async (req, res) => {
    req.body.enrollmentType = 'paid';
    return registerEnrollmentController(req, res);
};

const getMyEnrollmentsController = async (req, res) => {
    try {
        const playerId = req.user._id;
        const enrollments = await Enrollment.find({ playerId }).populate({
            path: 'programId',
            populate: [
                { path: 'coachId', select: 'name email' },
                { path: 'sportId', select: 'name' }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({ message: 'Joined Programs Retrieved.', count: enrollments.length, data: enrollments });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Enrollments.', error: error.message });
    }
};

const getCoachProgramEnrolledPlayersController = async (req, res) => {
    try {
        const coachId = req.user._id;
        const { programId } = req.params;

        const program = await TrainingProgram.findOne({ _id: programId, coachId });
        if (!program) return res.status(403).json({ message: 'Unauthorized. Program does not belong to you.' });

        const enrollments = await Enrollment.find({ programId, paymentStatus: 'completed' }).populate('playerId', 'name email').sort({ joinedAt: -1 });
        const totalSessions = await TrainingSession.countDocuments({ programId });

        const playerRoster = await Promise.all(enrollments.map(async (enr) => {
            const playerProfile = await Player.findOne({ userId: enr.playerId._id });
            const completedCount = await SessionProgress.countDocuments({ playerId: enr.playerId._id, programId, completed: true });
            const progressPercentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

            return {
                enrollmentId: enr._id,
                joinedAt: enr.joinedAt,
                player: enr.playerId,
                profile: playerProfile,
                completedSessionsCount: completedCount,
                totalSessionsCount: totalSessions,
                progressPercentage
            };
        }));

        return res.status(200).json({ message: 'Enrolled Players Retrieved.', count: playerRoster.length, data: playerRoster });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Enrolled Players.', error: error.message });
    }
};

module.exports = {registerEnrollmentController,loginEnrollmentController,fetchingEnrollmentController,fetchingSingelEnrollmentController,editEnrollmentController,joinFreeProgramController,initiatePaidEnrollmentController,getMyEnrollmentsController,getCoachProgramEnrolledPlayersControlle};
