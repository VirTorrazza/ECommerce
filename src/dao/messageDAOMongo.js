import messageModel from "./models/message.model.js";

export default class MessageDAOMongo{
    constructor(){
        this.model=messageModel; 
    }
      

    create= async(user, message)=> {
        try {
            let newMessage = new messageModel({
               user:user,
               message: message
            });
            return await newMessage.save();
        } catch (error) {
            throw new Error(`Error creating message in DAO: ${error.message}`);
        }
    }

    getAll= async()=>{
        let result = await messageModel.find();
        return result;
    }
}