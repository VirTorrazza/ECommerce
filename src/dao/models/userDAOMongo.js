import userModel from "./user.model";

export default class userDAOMongo{
    constructor(){
        this.model=userModel; // Use userModel  también podría hacer model=userModel
    }
    
    getAll=async ()=> {
        try {
            const users = await this.model.find();
            return users;
        } catch (error) {
            throw new Error(`Error getting all users: ${error.message}`);
        }
    }

    getUserById= async (id) =>{
        try {
            const user = await this.model.findById(id);
            return user;
        } catch (error) {
            throw new Error(`Error getting user by ID: ${error.message}`);
        }
    }

    getUserByEmail= async (email)=> {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    save = async (userData) => {
        try {
            const user = await this.model.create(userData);
            return user;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            const deletedUser = await this.model.findByIdAndDelete(id);
            if (!deletedUser) {
                return { status: 'error', message: 'User not found', statusCode: 404 };
            }
            return { status: 'success', message: 'User deleted successfully', statusCode: 200 };
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
    
    update = async (id, newData) => {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(id, newData, { new: true });
            if (!updatedUser) {
                return { status: 'error', message: 'User not found', statusCode: 404 };
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    updatePassword = async (user, password) => {
        try{
            const updatedUser = await this.model.findByIdAndUpdate(user._id, { password: createHash(password) });
            if (!updatedUser) {
                return { status: 'error', message: 'User not found', statusCode: 404 };
            }
            return updatedUser;
        }catch (error) {
            throw new Error(`Error updating password: ${error.message}`);
        }
        
    }

    updateRole = async (user, role) => {
        const result = await this.model.findOneAndUpdate({ email:user }, { role: role });
        return result;
    }

    updateLastConn = async (email) => {
        const result = await this.model.findOneAndUpdate({ email:email }, { last_connection: Date.now() });
        return result;
    }

}