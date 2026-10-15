const TrainingSession = require('../../model/training/trainingModel');
const TrainingProgram = require('../../model/trainingProgram/trainingProgramModel');
const Enrollment = require('../../model/enrollment/enrollmentModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerTrainingController = async (req, res) => {
    try {
        const { programId, title, description, order, duration } = req.body;

        const training = await TrainingSession.create({
            programId, 
            title, 
            description: description || '', 
            order: order || 1, 
            duration: duration || '60 mins'
        });

        console.log('Training Successfully.', training);
        return res.status(201).json({ message: 'Training Successfully.', data: training });

    } catch (error) {
        console.log('Error While Register Training.', error);
        return res.status(500).json({ message: 'Error While Register Training.', error: error.message });
    }
};

const loginTrainingController = async (req, res) => {
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
        console.log('Error While Login Training.', error);
        return res.status(500).json({ message: 'Error While Login Training.', error: error.message });
    }
};

const fetchingTrainingController = async (req, res) => {
    try {
        const training = await TrainingSession.find();

        if (!training || training.length === 0) {
            console.log('Training not found.');
            return res.status(404).json({ message: 'Training not found.', data: null });
        }

        console.log('Training Fetching Successfully.', training);
        return res.status(200).json({ message: 'Training Fetching Successfully.', data: training });

    } catch (error) {
        console.log('Error While Fetching Training.', error);
        return res.status(500).json({ message: 'Error While Fetching Training.', error: error.message });
    }
};

const fetchingSingelTrainingController = async (req, res) => {
    try {
        const { id } = req.params;

        const training = await TrainingSession.findById(id);

        if (!training) {
            console.log('Training not found.');
            return res.status(404).json({ message: 'Training not found.', data: null });
        }

        console.log('Training Fetching successfully.', training);
        return res.status(200).json({ message: 'Training Fetching Successfully.', data: training });

    } catch (error) {
        console.log('Error While Fetching Training.', error);
        return res.status(500).json({ message: 'Error While Fetching Training.', error: error.message });
    }
};

const editTrainingController = async (req, res) => {
    try {
        const { id } = req.params;
        const { programId, title, description, order, duration } = req.body;

        const training = await TrainingSession.findByIdAndUpdate(id, {
            programId, title, description, order, duration
        }, {
            new: true,
            runValidators: true
        });

        if (!training) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('Training Edit successfully.', training);
        return res.status(200).json({ message: 'Training Edit Successfully.', data: training });

    } catch (error) {
        console.log('Error While Editing Training.', error);
        return res.status(500).json({ message: 'Error While Editing Training.', error: error.message });
    }
};

const addSessionController = registerTrainingController;
const updateSessionController = editTrainingController;

const deleteSessionController = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TrainingSession.findByIdAndDelete(sessionId);
        if (!session) return res.status(404).json({ message: 'Session Not Found.' });
        return res.status(200).json({ message: 'Training Session Deleted Successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error Deleting Session.', error: error.message });
    }
};

const reorderSessionsController = async (req, res) => {
    try {
        const { programId, sessionOrders } = req.body;
        const updatePromises = sessionOrders.map(item =>
            TrainingSession.updateOne({ _id: item.sessionId, programId }, { order: item.order })
        );
        await Promise.all(updatePromises);
        return res.status(200).json({ message: 'Sessions reordered successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error Reordering Sessions.', error: error.message });
    }
};

const getProgramSessionsController = async (req, res) => {
    try {
        const { programId } = req.params;
        const sessions = await TrainingSession.find({ programId }).sort({ order: 1 });
        return res.status(200).json({ message: 'Sessions Retrieved.', count: sessions.length, data: sessions });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Sessions.', error: error.message });
    }
};

module.exports = {registerTrainingController,loginTrainingController,fetchingTrainingController,fetchingSingelTrainingController,editTrainingController,addSessionController,updateSessionController,deleteSessionController,reorderSessionsController,getProgramSessionsController};
