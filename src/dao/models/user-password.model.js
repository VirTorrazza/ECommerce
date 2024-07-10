import mongoose from "mongoose";

const userPasswordCollection = 'userPasswords'; 
const userPasswordSchema = new mongoose.Schema({
	email: {
        type: String,
        required:true,
        ref: 'users'
    },
    token: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expireAfterSeconds:3000
    }
});

const userPasswordModel = mongoose.model(userPasswordCollection, userPasswordSchema);

export default userPasswordModel;
