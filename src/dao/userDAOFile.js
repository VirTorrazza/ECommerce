import fs from 'fs'

export default class userDAOFile{
    constructor(){
        this.path='/src/data/users.json';
        this.init();
    }

    async init() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
                console.log(`Created empty file: ${this.path}`);
            }
        } catch (error) {
            console.error('Error initializing user data file:', error);
            throw new Error('Cannot initialize user data');
        }
    }

    readFile= async ()=>{
        let data= fs.promises.readFile(this.path,'utf-8'); //'utf-8' ensures string encoding
        return JSON.parse(data);

    }

    getAll= async()=>{
        return await this.readFile() //return the content of the file as promise
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
            return user;
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Cannot save user');
        }
    }
    
    writeFile = async (data) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing file:', error);
            throw new Error('Cannot write file');
        }
    }
    
    async deleteUser(userIdToDelete) {
        try {
            let users = await this.getAllUsers();
            const indexToDelete = users.findIndex(user => user.id === userIdToDelete);

            if (indexToDelete === -1) {
                throw new Error('User not found'); 
            }

            users.splice(indexToDelete, 1);
            await this.writeFile(users);
            console.log(`User with ID ${userIdToDelete} deleted successfully.`);
            
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Cannot delete user');
        }
    }

    async update(id, newData) {
        try {
            let users = await this.getAllUsers();
            const indexToUpdate = users.findIndex(user => user.id === id);
    
            if (indexToUpdate === -1) {
                throw new Error('User not found'); 
            }
    
            users[indexToUpdate] = newData;
            await this.writeFile(users);
    
            console.log(`User with ID ${id} updated successfully.`);
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Cannot update user');
        }
    }

    async getByEmail(email) {
        try {
            const users = await this.getAll(); 
            const user = users.find(user => user.email === email);
    
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error(`Error finding user by email: ${error.message} in UserDAOFile`);
        }
    }

    async updateRole(userEmail, newRole) {
        try {
            const users = await this.getAll();
            
            const user = users.find(user => user.email === userEmail);
    
            if (!user) {
                throw new Error(`User with email ${userEmail} not found.`);
            }

            const index = users.indexOf(user);
            users[index].role = newRole;

            await this.writeFile(users);
            console.log(`User with email ${userEmail} role updated to ${newRole} successfully.`);
            return user[index];
            
        } catch (error) {
            console.error('Error updating user role:', error);
            throw new Error(`Error updating user role: ${error.message}`);
        }
    }
    
    async updatePassword(user, password) {
        try {
        
            let users = await this.getAllUsers();

            const indexToUpdate = users.findIndex(u => u.id === user.id);

            if (indexToUpdate === -1) {
                throw new Error('User not found.');
            }

            users[indexToUpdate].password = createHash(password); // Update user's password

            await this.writeFile(users);

            console.log(`Password updated successfully for user with id ${user.id}.`);
            return users[indexToUpdate];
        } catch (error) {
            console.error('Error updating password:', error);
            throw new Error(`Error updating password: ${error.message}`);
        }
    }
    
    async updateLastConnection(email) {
        try {
           
            let users = await this.getAllUsers();
            const indexToUpdate = users.findIndex(u => u.email === email);

            if (indexToUpdate === -1) {
                throw new Error(`User with email ${email} not found.`);
            }

            users[indexToUpdate].lastConnection = new Date();
            await this.writeFile(users);

            console.log(`Last connection updated successfully for user with email ${email}.`);

            return users[indexToUpdate];
        } catch (error) {
            console.error('Error updating last connection:', error);
            throw new Error(`Error updating last connection: ${error.message}`);
        }
    }

}