import logger from "../logger/logger.js";

export default class UserDAOMongo {
    constructor(userModel) {
        this.model = userModel;
    }

    async getAll() {
        try {
            const users = await this.model.find();
            logger.debug("Successful retrieval of users in userDAOMongo");
            return users;
        } catch (error) {
            logger.error(`Error getting all users in userDAOMongo: ${error.message}`);
            throw new Error(`Error getting all users: ${error.message}`);
        }
    }

    async getById(id) {
        console.log("El id es" + id)
        try {
            const user = await this.model.findById(id);
            if (!user) {
                logger.error(`User with ID: ${id} not found`);
                throw new Error("User not found.");
            }
            logger.debug(`Successfull retrieval of user with ID ${id}`);
            return user;
        } catch (error) {
            logger.error(`Error getting user by ID: ${error.message} in userDAOMongo`);
            throw new Error(`Error getting user by ID: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            const user = await this.model.findOne({email:email});
            logger.debug(`Successfull retrieval of user with email ${email}`);
            return user;
        } catch (error) {
            logger.error(`Error finding user by email: ${error.message} in UserDAOMongo`);
            throw new Error(`Error finding user by email: ${error.message} in UserDAOMongo`);
        }
    }
    

    async save(userData) {
        try {
            const user = await this.model.create(userData);
            logger.debug(`Successfull user creation in userDAOMongo`);
            return user;
        } catch (error) {
            logger.error(`Error creating user: ${error.message} in userDAOMongo`);
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const deletedUser = await this.model.findByIdAndDelete(id);
            if (!deletedUser) {
                logger.error(`Error deleting user with ID: ${id} in userDAOMongo. User not found`);
                throw new Error("User not found.");
            }
            logger.debug(`Successfull deletion of user with ID ${id}`);
            return deletedUser;
        } catch (error) {
            logger.error(`Error deleting user: ${error.message} in userDAOMongo`);
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async update(id, newData) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(id, newData, { new: true });
            if (!updatedUser) {
                logger.error(`Error updating user with ID: ${id} in userDAOMongo. User not found`);
                throw new Error("User not found.");
            }
            logger.debug(`Successfull update of user with ID ${id} in userDAOMongo`);
            return updatedUser;
        } catch (error) {
            logger.error(`Error updating user: ${error.message} in userDAOMongo`);
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async updatePassword(user, password) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(user._id, { password: createHash(password) });
            if (!updatedUser) {
                logger.error(`Error updating user's password in userDAOMongo. User not found`);
                throw new Error("User not found.");
            }
            logger.debug("User password updated successfully in userDAOMongo");
            return updatedUser;
        } catch (error) {
            logger.error(`Error updating password: ${error.message} in userDAOMongo`);
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
                logger.error(`Error updating user's role in userDAOMongo. User with email ${userEmail} not found`);
                throw new Error("User not found.");
            }
            logger.debug("User role updated successfully in userDAOMongo");
            return updatedUser;
        } catch (error) {
            logger.error(`Error updating user role: ${error.message} in userDAOMongo`);
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
                logger.error(`Error updating user's last connection in userDAOMongo. User with email ${userEmail} not found`);
                throw new Error("User not found.");
            }
            logger.debug("User last connection updated successfully in userDAOMongo");
            return updatedUser;
        } catch (error) {
            logger.error(`Error updating last connection: ${error.message} in userDAOMongo`);
            throw new Error(`Error updating last connection: ${error.message}`);
        }
    }
}
