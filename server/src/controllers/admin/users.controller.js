import * as usersService from '../../services/admin/users.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await usersService.updateUser(req.params.id, req.body);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
