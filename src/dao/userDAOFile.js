import fs from 'fs';
import logger from '../logger/logger.js';

export default class userDAOFile{
    constructor(){
        this.path='/src/data/users.json';
        this.init();
    }

    async init() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
                logger.debug(`Created empty file in userDAOFile: ${this.path}`);
            }
        } catch (error) {
            logger.error(`Error: ${error}  when initializing user data file`);
            throw new Error('Cannot initialize user data');
        }
    }

    readFile= async ()=>{
        try{
            let data= fs.promises.readFile(this.path,'utf-8'); //'utf-8' ensures string encoding
            logger.debug(`Successfull reading file operation in userDAOFile`);
            return JSON.parse(data);
        }catch (error) {
            logger.error(`Reading File Error: ${error}`);
            throw new Error('Cannot read file');
        }
    }

    getAll= async()=>{
        try {
            logger.debug(`awaiting getAll users operation`);
            return await this.readFile();
        } catch (error) {
            logger.error(`Error at getting users in DAOFile: ${error}`);
            throw new Error('Cannot get all users');
        }
    }

    save = async (user) => {
        try {
            let users = await this.getAll();
            if (users.length === 0) { // Generate a new ID for the user
                user.id = 1;
            } else {
                user.id = users[users.length - 1].id + 1;
            }
            users.push(user);
            await this.writeFile(users);
            logger.debug(`Successfull save user operation`);
            return user;
        } catch (error) {
            logger.error(`Error when saving user in DAOFile: ${error}`);
            throw new Error('Cannot save user');
        }
    }
    
    writeFile = async (data) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error(`Error ${error} at writing file operation in userDAOFile`);
            throw new Error('Cannot write file');
        }
    }
    
    async deleteUser(userIdToDelete) {
        try {
            let users = await this.getAllUsers();
            const indexToDelete = users.findIndex(user => user.id === userIdToDelete);

            if (indexToDelete === -1) {
                logger.error(`User with ID ${userIdToDelete} not found in delete operation`);
                throw new Error('User not found'); 
            }

            users.splice(indexToDelete, 1);
            await this.writeFile(users);
            logger.debug(`User with ID ${userIdToDelete} deleted successfully.`);
            
        } catch (error) {
            logger.error(`Error ${error} at delete user operation`);
            throw new Error('Cannot delete user');
        }
    }

    async update(id, newData) {
        try {
            let users = await this.getAllUsers();
            const indexToUpdate = users.findIndex(user => user.id === id);
    
            if (indexToUpdate === -1) {
                logger.error(`User with ID ${id} not found in update operation`)
                throw new Error('User not found'); 
            }
    
            users[indexToUpdate] = newData;
            await this.writeFile(users);
    
            logger.debug(`User with ID ${id} updated successfully.`);
        } catch (error) {
            logger.error(`Error ${error} when updating user in DAOFile`);
            throw new Error('Cannot update user');
        }
    }

    async getByEmail(email) {
        try {
            const users = await this.getAll(); 
            const user = users.find(user => user.email === email);
    
            if (!user) {
                logger.error(`User with email ${email} not found in getByEmail operation`)
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            logger.error(`Error ${error} when finding user by email in DAOFile`);
            throw new Error(`Error finding user by email: ${error.message} in UserDAOFile`);
        }
    }

    async updateRole(userEmail, newRole) {
        try {
            const users = await this.getAll();
            
            const user = users.find(user => user.email === userEmail);
    
            if (!user) {
                logger.error(`User with email ${userEmail} not found in updateRole operation`)
                throw new Error(`User with email ${userEmail} not found.`);
            }

            const index = users.indexOf(user);
            users[index].role = newRole;

            await this.writeFile(users);
            logger.debug(`User with email ${userEmail} role updated to ${newRole} successfully.`);
            return user[index];
            
        } catch (error) {
            logger.error(`Error ${error} when updating user role in DAOFile`);
            throw new Error(`Error updating user role: ${error.message}`);
        }
    }
    
    async updatePassword(user, password) {
        try {
        
            let users = await this.getAllUsers();

            const indexToUpdate = users.findIndex(u => u.id === user.id);

            if (indexToUpdate === -1) {
                logger.error(`User ${user.id} not found in updatePassword operation`)
                throw new Error('User not found.');
            }

            users[indexToUpdate].password = createHash(password); // Update user's password

            await this.writeFile(users);

            logger.debug(`Password updated successfully for user with id ${user.id}.`);
            return users[indexToUpdate];
        } catch (error) {
            logger.error(`Error ${error} when updating password in DAOFile`);
            throw new Error(`Error updating password: ${error.message}`);
        }
    }
    
    async updateLastConnection(email) {
        try {
           
            let users = await this.getAllUsers();
            const indexToUpdate = users.findIndex(u => u.email === email);

            if (indexToUpdate === -1) {
                logger.error(`User with email ${email} not found in updateLastConnection operation`)
                throw new Error(`User with email ${email} not found.`);
            }

            users[indexToUpdate].lastConnection = new Date();
            await this.writeFile(users);

            logger.debug(`Last connection updated successfully for user with email ${email}.`);

            return users[indexToUpdate];
        } catch (error) {
            logger.error(`Error ${error} when updating last connection in DAOFile`);
            throw new Error(`Error updating last connection: ${error.message}`);
        }
    }
}