export default class UserDAOMongo {
    constructor(userModel) {
        this.model = userModel;
    }

    async getAll() {
        try {
            const users = await this.model.find();
            return users;
        } catch (error) {
            throw new Error(`Error getting all users: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const user = await this.model.findById(id);
            if (!user) {
                throw new Error("User not found.");
            }
            return user;
        } catch (error) {
            throw new Error(`Error getting user by ID: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            const user = await this.model.findOne({email:email});
            return user;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message} in UserDAO`);
        }
    }
    

    async save(userData) {
        try {
            const user = await this.model.create(userData);
            return user;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const deletedUser = await this.model.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new Error("User not found.");
            }
            return deletedUser;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async update(id, newData) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(id, newData, { new: true });
            if (!updatedUser) {
                throw new Error("User not found.");
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async updatePassword(user, password) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(user._id, { password: createHash(password) });
            if (!updatedUser) {
                throw new Error("User not found.");
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating password: ${error.message}`);
        }
    }

    async updateRole(userEmail, newRole) {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { email: userEmail },
                { role: newRole },
                { new: true }
            );
            if (!updatedUser) {
                throw new Error("User not found.");
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user role: ${error.message}`);
        }
    }

    async updateLastConnection(email) {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { email: email },
                { lastConnection: new Date() },
                { new: true }
            );
            if (!updatedUser) {
                throw new Error("User not found.");
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating last connection: ${error.message}`);
        }
    }
}
