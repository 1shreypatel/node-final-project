const Sport = require('../../model/sport/sportModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerSportController = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const sport = await Sport.create({
            name, 
            description, 
            status
        });

        console.log('Sport Successfully.', sport);
        return res.status(201).json({ message: 'Sport Successfully.', data: sport });

    } catch (error) {
        console.log('Error While Register Sport.', error);
        return res.status(500).json({ message: 'Error While Register Sport.', error: error.message });
    }
};

const loginSportController = async (req, res) => {
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
        console.log('Error While Login Sport.', error);
        return res.status(500).json({ message: 'Error While Login Sport.', error: error.message });
    }
};

const fetchingSportController = async (req, res) => {
    try {
        const sport = await Sport.find();

        if (!sport || sport.length === 0) {
            console.log('Sport not found.');
            return res.status(404).json({ message: 'Sport not found.', data: null });
        }

        console.log('Sport Fetching Successfully.', sport);
        return res.status(200).json({ message: 'Sport Fetching Successfully.', data: sport });

    } catch (error) {
        console.log('Error While Fetching Sport.', error);
        return res.status(500).json({ message: 'Error While Fetching Sport.', error: error.message });
    }
};

const fetchingSingelSportController = async (req, res) => {
    try {
        const { id } = req.params;

        const sport = await Sport.findById(id);

        if (!sport) {
            console.log('Sport not found.');
            return res.status(404).json({ message: 'Sport not found.', data: null });
        }

        console.log('Sport Fetching successfully.', sport);
        return res.status(200).json({ message: 'Sport Fetching Successfully.', data: sport });

    } catch (error) {
        console.log('Error While Fetching Sport.', error);
        return res.status(500).json({ message: 'Error While Fetching Sport.', error: error.message });
    }
};

const editSportController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const sport = await Sport.findByIdAndUpdate(id, {
            name, description, status
        }, {
            new: true,
            runValidators: true
        });

        if (!sport) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('Sport Edit successfully.', sport);
        return res.status(200).json({ message: 'Sport Edit Successfully.', data: sport });

    } catch (error) {
        console.log('Error While Editing Sport.', error);
        return res.status(500).json({ message: 'Error While Editing Sport.', error: error.message });
    }
};

const createSportController = registerSportController;
const getAllSportsController = fetchingSportController;
const updateSportController = editSportController;
const deleteSportController = async (req, res) => {
    try {
        const { sportId } = req.params;
        const sport = await Sport.findByIdAndDelete(sportId);
        if (!sport) return res.status(404).json({ message: 'Sport Category Not Found.' });
        return res.status(200).json({ message: 'Sport Category Deleted Successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error Deleting Sport.', error: error.message });
    }
};

module.exports = {registerSportController,loginSportController,fetchingSportController,fetchingSingelSportController,editSportController,createSportController,getAllSportsController,updateSportController,deleteSportControlle};
