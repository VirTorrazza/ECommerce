import config from "../config/config.js";
import userModel from "../dao/models/user.model.js"
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import UserDAOMongo from '../dao/models/userDAOMongo.js'; 
import ProductDAOMongo from '../dao/models/productDAOMongo.js';
import CartDAOMongo from '../dao/models/cartDAOMongo.js';
import UserDAOFile from '../dao/models/userDAOFile.js'; 
import ProductDAOFile from '../dao/models/productDAOFile.js';
import CartDAOFile from '../dao/models/cartDAOFile.js';
import TicketDAOFile from "./models/TicketDAOFile.js";
import ticketModel from "./models/tickets.model.js";
import TicketDAOMongo from "./models/TicketDAOMongo.js";

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
