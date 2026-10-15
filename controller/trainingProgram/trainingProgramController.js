const TrainingProgram = require('../../model/trainingProgram/trainingProgramModel');
const TrainingSession = require('../../model/training/trainingModel');
const Coach = require('../../model/coach/coachModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerTrainingProgramController = async (req, res) => {
    try {
        const { coachId, sportId, name, description, difficultyLevel, duration, requirements, learningOutcomes, fee, approvalStatus, rejectionReason } = req.body;
        let image = req.body.image;

        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const trainingProgram = await TrainingProgram.create({
            coachId: coachId || req.user?._id,
            sportId,
            name,
            description,
            difficultyLevel: difficultyLevel || 'Beginner',
            duration,
            requirements: requirements || 'None',
            learningOutcomes,
            image: image || '',
            fee: fee || 0,
            approvalStatus: approvalStatus || 'draft',
            rejectionReason: rejectionReason || ''
        });

        console.log('TrainingProgram Successfully.', trainingProgram);
        return res.status(201).json({ message: 'TrainingProgram Successfully.', data: trainingProgram });

    } catch (error) {
        console.log('Error While Register TrainingProgram.', error);
        return res.status(500).json({ message: 'Error While Register TrainingProgram.', error: error.message });
    }
};

const loginTrainingProgramController = async (req, res) => {
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

const fetchingTrainingProgaramController = async (req, res) => {
    try {
        const trainingProgram = await TrainingProgram.find()
            .populate('coachId', 'name email')
            .populate('sportId', 'name');

        if (!trainingProgram || trainingProgram.length === 0) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching Successfully.', trainingProgram);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: trainingProgram });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const fetchingSingelTrainingProgramController = async (req, res) => {
    try {
        const { id } = req.params;

        const trainingProgram = await TrainingProgram.findById(id)
            .populate('coachId', 'name email')
            .populate('sportId', 'name');

        if (!trainingProgram) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching successfully.', trainingProgram);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: trainingProgram });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const editTrainingProgramController = async (req, res) => {
    try {
        const { id } = req.params;
        const { coachId, sportId, name, description, difficultyLevel, duration, requirements, learningOutcomes, image, fee, approvalStatus, rejectionReason } = req.body;

        const trainingProgram = await TrainingProgram.findByIdAndUpdate(id, {
            coachId, sportId, name, description, difficultyLevel, duration, requirements, learningOutcomes, image, fee, approvalStatus, rejectionReason
        }, {
            new: true,
            runValidators: true
        });

        if (!trainingProgram) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('User Edit successfully.', trainingProgram);
        return res.status(200).json({ message: 'User Edit Successfully.', data: trainingProgram });

    } catch (error) {
        console.log('Error While Editing User.', error);
        return res.status(500).json({ message: 'Error While Editing User.', error: error.message });
    }
};

const createProgramController = async (req, res) => {
    req.body.coachId = req.user._id;
    return registerTrainingProgramController(req, res);
};

const submitProgramForApprovalController = async (req, res) => {
    try {
        const coachId = req.user._id;
        const { programId } = req.params;

        const program = await TrainingProgram.findOne({ _id: programId, coachId });
        if (!program) return res.status(404).json({ message: 'Program Not Found or unauthorized access.' });

        const sessionCount = await TrainingSession.countDocuments({ programId });
        if (sessionCount === 0) return res.status(400).json({ message: 'Please add at least one session before submitting.' });

        program.approvalStatus = 'pending';
        program.rejectionReason = '';
        await program.save();

        return res.status(200).json({ message: 'Program submitted to Admin for approval.', data: program });
    } catch (error) {
        return res.status(500).json({ message: 'Error Submitting Program.', error: error.message });
    }
};

const updateProgramController = async (req, res) => {
    try {
        const coachId = req.user._id;
        const { programId } = req.params;
        const program = await TrainingProgram.findOne({ _id: programId, coachId });
        if (!program) return res.status(403).json({ message: 'Unauthorized. You can only manage your own programs.' });

        if (program.approvalStatus === 'rejected') program.approvalStatus = 'draft';
        Object.assign(program, req.body);
        if (req.file) {
            program.image = `/uploads/${req.file.filename}`;
        }
        await program.save();

        return res.status(200).json({ message: 'Program Updated Successfully.', data: program });
    } catch (error) {
        return res.status(500).json({ message: 'Error Updating Program.', error: error.message });
    }
};

const deleteProgramController = async (req, res) => {
    try {
        const { programId } = req.params;
        const filter = req.user.role === 'admin' ? { _id: programId } : { _id: programId, coachId: req.user._id };

        const program = await TrainingProgram.findOneAndDelete(filter);
        if (!program) return res.status(403).json({ message: 'Program Not Found or unauthorized access.' });

        await TrainingSession.deleteMany({ programId });
        return res.status(200).json({ message: 'Program and sessions deleted.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error Deleting Program.', error: error.message });
    }
};

const getMyCoachProgramsController = async (req, res) => {
    try {
        const coachId = req.user._id;
        const programs = await TrainingProgram.find({ coachId }).populate('sportId', 'name').sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Coach Programs Retrieved.', count: programs.length, data: programs });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Programs.', error: error.message });
    }
};

const reviewProgramController = async (req, res) => {
    try {
        const { programId } = req.params;
        const { action, rejectionReason } = req.body;

        if (!['approve', 'reject'].includes(action)) return res.status(400).json({ message: "Action must be 'approve' or 'reject'." });

        const program = await TrainingProgram.findById(programId);
        if (!program) return res.status(404).json({ message: 'Program Not Found.' });

        if (action === 'approve') {
            program.approvalStatus = 'approved';
            program.rejectionReason = '';
        } else {
            if (!rejectionReason) return res.status(400).json({ message: 'Rejection reason is required.' });
            program.approvalStatus = 'rejected';
            program.rejectionReason = rejectionReason;
        }

        await program.save();
        return res.status(200).json({ message: `Program ${program.approvalStatus}.`, data: program });
    } catch (error) {
        return res.status(500).json({ message: 'Error Reviewing Program.', error: error.message });
    }
};

const getAllProgramsAdminController = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { approvalStatus: status } : {};
        const programs = await TrainingProgram.find(filter).populate('coachId', 'name email').populate('sportId', 'name').sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Admin Programs Retrieved.', count: programs.length, data: programs });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Admin Programs.', error: error.message });
    }
};

const browseApprovedProgramsController = async (req, res) => {
    try {
        const { search, sportId, difficultyLevel } = req.query;
        let queryFilter = { approvalStatus: 'approved' };

        if (sportId) queryFilter.sportId = sportId;
        if (difficultyLevel) queryFilter.difficultyLevel = difficultyLevel;
        if (search) {
            queryFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const programs = await TrainingProgram.find(queryFilter).populate('coachId', 'name email').populate('sportId', 'name').sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Approved Programs Retrieved.', count: programs.length, data: programs });
    } catch (error) {
        return res.status(500).json({ message: 'Error Browsing Programs.', error: error.message });
    }
};

const getProgramByIdController = async (req, res) => {
    try {
        const { programId } = req.params;
        const program = await TrainingProgram.findById(programId).populate('coachId', 'name email').populate('sportId', 'name');

        if (!program) return res.status(404).json({ message: 'Program Not Found.' });

        const coachProfile = await Coach.findOne({ userId: program.coachId._id });
        const sessions = await TrainingSession.find({ programId }).sort({ order: 1 });

        return res.status(200).json({ message: 'Program Details Retrieved.', data: { program, coachProfile, sessions } });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Program Details.', error: error.message });
    }
};

module.exports = {registerTrainingProgramController,loginTrainingProgramController,fetchingTrainingProgaramController,fetchingSingelTrainingProgramController,editTrainingProgramController,createProgramController,submitProgramForApprovalController,updateProgramController,deleteProgramController,getMyCoachProgramsController,reviewProgramController,getAllProgramsAdminController,browseApprovedProgramsController,getProgramByIdController};
