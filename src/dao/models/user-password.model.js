import mongoose from "mongoose";

const userPasswordCollection = 'userpasswords'; // Nombre de la colleccion

const userPasswordSchema = new mongoose.Schema({
	
    email: { 
        type: String,
        ref: "users"
    },
    token: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        expireAfterSeconds: 3600
    }
});

const userPasswordModel = mongoose.model(userPasswordCollection, userPasswordSchema);

export default userPasswordModel;
