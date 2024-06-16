import config from "../config/config";

export default class PersistenceFactory {
    static getPersistence = async () => {
        try {
            switch (config.persistence.type) {
                case 'FILE':
                    let { default: userDAOFile } = await import('../dao/models/userDAOFile.js');
                    return new userDAOFile();
                
                case 'MONGO':
                    let { default: userDAOMongo } = await import('../dao/models/userDAOMongo.js');
                    return new userDAOMongo();
                
                default:
                    throw new Error(`Unsupported persistence type: ${config.persistence.type}`);
            }
        } catch (error) {
            console.error('Error during persistence setup:', error);
            throw error; 
        }
    }
}
