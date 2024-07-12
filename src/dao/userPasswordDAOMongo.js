//import userPasswordModel from "./models/user-password.model.js";

export default class UserPasswordDAOMongo {
    constructor(userPasswordModel) {
        this.model = userPasswordModel;
    }

    async save(userToken) {
        try {
            const result = await this.model.create(userToken);
            return result;
        } catch (error) {
            console.error("Error saving user token:", error);
            throw error;
        }
    }

    async delete(email) {
        try {
            console.log("Email en el DAO:", email);
            const result = await this.model.findOneAndDelete({ email });
            console.log("Resultado de eliminación:", result);
            return result;
        } catch (error) {
            console.error("Error deleting user password:", error);
            throw error;
        }
    }
}
