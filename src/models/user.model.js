import mongoose from "mongoose";

const userCollection= "users";

const userSchema= new mongoose.Schema({ //Schema for users documents
    first_name: String,
    last_name :String,
    email: String,
    age : Number,
    password :String,
    role: String
})

mongoose.set("strictQuery",false);

const userModel=moongose.model(userCollection,userSchema);

export default userModel