import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "carts" // Reference schema
    },
    role: { type: String, default: "user" } // Adding a default value for the role field
});

mongoose.set("strictQuery", false);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
