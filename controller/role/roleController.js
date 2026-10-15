const Role = require('../../model/role/roleModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');

const registerRoleController = async (req, res) => {
    try {
        const { name, description } = req.body;

        const role = await Role.create({
            name,
            description,
        });

        console.log('Role Successfully.', role);
        return res.status(201).json({ message: 'Role Successfully.', data: role });

    } catch (error) {
        console.log('Error While Register Role.', error);
        return res.status(500).json({ message: 'Error While Register Role.', error: error.message });
    }
};

const loginRoleController = async (req, res) => {
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
        console.log('Error While Login Role.', error);
        return res.status(500).json({ message: 'Error While Login Role.', error: error.message });
    }
};

const fetchingRoleController = async (req, res) => {
    try {
        const role = await Role.find();

        if (!role || role.length === 0) {
            console.log('Role not found.');
            return res.status(404).json({ message: 'Role not found.', data: null });
        }

        console.log('Role Fetching Successfully.', role);
        return res.status(200).json({ message: 'Role Fetching Successfully.', data: role });

    } catch (error) {
        console.log('Error While Fetching Role.', error);
        return res.status(500).json({ message: 'Error While Fetching Role.', error: error.message });
    }
};

const fetchingSingelRoleController = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);

        if (!role) {
            console.log('Role not found.');
            return res.status(404).json({ message: 'Role not found.', data: null });
        }

        console.log('Role Fetching successfully.', role);
        return res.status(200).json({ message: 'Role Fetching Successfully.', data: role });

    } catch (error) {
        console.log('Error While Fetching Role.', error);
        return res.status(500).json({ message: 'Error While Fetching Role.', error: error.message });
    }
};

const editRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const role = await Role.findByIdAndUpdate(id, {
            name, description
        }, {
            new: true,
            runValidators: true
        });

        if (!role) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('Role Edit successfully.', role);
        return res.status(200).json({ message: 'Role Edit Successfully.', data: role });

    } catch (error) {
        console.log('Error While Editing Role.', error);
        return res.status(500).json({ message: 'Error While Editing Role.', error: error.message });
    }
};

module.exports = {registerRoleController,loginRoleController,fetchingRoleController,fetchingSingelRoleController,editRoleController};
