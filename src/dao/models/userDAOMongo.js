import userModel from "./user.model";

export default class userDAOMongo {
    constructor() {
        this.model = userModel;
    }

    async getAll() {
        try {
            const users = await this.model.find();
            return users;
        } catch (error) {
            throw new Error("Error getting all users.");
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
            throw new Error("Error getting user by ID.");
        }
    }

    async getByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            if (!user) {
                throw new Error("User not found.");
            }
            return user;
        } catch (error) {
            throw new Error("Error finding user by email.");
        }
    }

    async save(userData) {
        try {
            const user = await this.model.create(userData);
            return user;
        } catch (error) {
            throw new Error("Error creating user.");
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
            throw new Error("Error deleting user.");
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
            throw new Error("Error updating user.");
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
            throw new Error("Error updating password.");
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
            throw new Error("Error updating user role.");
        }
    }

    async updateLastConnection(email) {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { email: email },
                { last_connection: new Date() },
                { new: true }
            );
            if (!updatedUser) {
                throw new Error("User not found.");
            }
            return updatedUser;
        } catch (error) {
            throw new Error("Error updating last connection.");
        }
    }
}
