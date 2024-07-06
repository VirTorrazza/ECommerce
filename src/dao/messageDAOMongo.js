import messageModel from "./models/message.model.js";
import logger from "../logger/logger.js";

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
            logger.debug(`Await message creation in DAOMongo`);
            return await newMessage.save();
        } catch (error) {
            logger.error(`Error creating message in DAO: ${error.message}`);
            throw new Error(`Error creating message in DAO: ${error.message}`);
        }
    }

    getAll= async()=>{
        let result = await messageModel.find();
        return result;
    }
}