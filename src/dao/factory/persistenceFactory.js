import config from "../../config/config.js";
import userModel from "../models/user.model.js"
import productModel from "../models/product.model.js"
import cartModel from "../models/cart.model.js";
import UserDAOMongo from '../userDAOMongo.js'; 
import ProductDAOMongo from '../productDAOMongo.js';
import CartDAOMongo from '../cartDAOMongo.js';
import UserDAOFile from '../userDAOFile.js'; 
import ProductDAOFile from '../productDAOFile.js';
import CartDAOFile from '../cartDAOFile.js';
import TicketDAOFile from "../TicketDAOFile.js";
import ticketModel from "../models/ticket.model.js";
import TicketDAOMongo from "../TicketDAOMongo.js";

export default class PersistenceFactory {
    static getPersistence = async (entityType) => {
        try {
            switch (config.persistence.type) {
                case 'FILE':
                    switch (entityType) {
                        case 'USER':
                            return new UserDAOFile();
                        case 'PRODUCT':
                            return new ProductDAOFile();
                        case 'CART':
                            return new CartDAOFile();
                        case 'TICKET':
                            return new TicketDAOFile();
                        default:
                            throw new Error(`Unsupported entity type for FILE persistence: ${entityType}`);
                    }
                
                case 'MONGO':
                    switch (entityType) {
                        case 'USER':
                            return new UserDAOMongo(userModel);
                        case 'PRODUCT':
                            return new ProductDAOMongo(productModel);
                        case 'CART':
                            return new CartDAOMongo(cartModel);
                        case 'TICKET':
                            return new TicketDAOMongo(ticketModel);
                        default:
                            throw new Error(`Unsupported entity type for MONGO persistence: ${entityType}`);
                    }
                
                default:
                    throw new Error(`Unsupported persistence type: ${config.persistence.type}`);
            }
        } catch (error) {
            console.error('Error during persistence setup:', error);
            throw error; 
        }
    }
}
