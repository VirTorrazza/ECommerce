import userPasswordModel from "./models/user-password.model.js";

export default class UserPasswordDAOMongo {
    constructor() {
        this.model=userPasswordModel;
    }

    save = async (userToken) => {
        const result = await this.model.create(userToken);
        return result;
    }

    delete = async (email) => {
        try {
            const result = await this.model.findOneAndDelete({ email });
            console.log(result);
        } catch (error) {
            console.error("Error deleting user password:", error);
            throw error; 
        }
    };
    

}