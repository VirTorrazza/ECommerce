import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique:true, required: true},
    age: {type: Number, required: true},
    password:{type: String, required: true},
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "carts" // Reference schema
    },
    role: {type: String, enum: ['user', 'admin', 'premium'], default: "user" } // Adding a default value for the role field
});

mongoose.set("strictQuery", false);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
