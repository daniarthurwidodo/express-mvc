"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    async getUsers(req, res) {
        try {
            const users = [
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ];
            res.status(200).json({
                success: true,
                data: users
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }
            const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    async createUser(req, res) {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                res.status(400).json({
                    success: false,
                    message: 'Name and email are required'
                });
                return;
            }
            const newUser = { id: Date.now(), name, email };
            res.status(201).json({
                success: true,
                data: newUser,
                message: 'User created successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map