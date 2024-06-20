import fs from 'fs'; 

export default class TicketDAOFile {
    constructor() {
        this.path = '/src/data/tickets.json';
        this.init();
    }

    async init() {
        try {
            if (!fs.access(this.path)) {
                fs.writeFile(this.path, JSON.stringify([]));
                console.log(`Created empty file: ${this.path}`);
            }
        } catch (error) {
            console.error('Error initializing ticket data file:', error);
            throw new Error('Cannot initialize ticket data');
        }
    }

    async readFile() {
        try {
            let data = fs.readFile(this.path, 'utf-8'); 
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
            throw new Error('Cannot read file');
        }
    }

    async getAll() {
        try {
            return await this.readFile();
        } catch (error) {
            console.error('Error getting all tickets:', error);
            throw new Error('Cannot get all tickets');
        }
    }

    async save(ticket) {
        try {
            let tickets = await this.getAll();
            if (tickets.length === 0) { 
                ticket.id = 1;
            } else {
                ticket.id = tickets[tickets.length - 1].id + 1;
            }
            tickets.push(ticket);
            await this.writeFile(tickets);
            return ticket;
        } catch (error) {
            console.error('Error saving ticket:', error);
            throw new Error('Cannot save ticket');
        }
    }

    async writeFile(data) {
        try {
            fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing file:', error);
            throw new Error('Cannot write file');
        }
    }

    async delete(ticketIdToDelete) {
        try {
            let tickets = await this.getAll();
            const indexToDelete = tickets.findIndex(ticket => ticket.id === ticketIdToDelete);

            if (indexToDelete === -1) {
                throw new Error('Ticket not found');
            }

            tickets.splice(indexToDelete, 1);
            await this.writeFile(tickets);
            console.log(`Ticket with ID ${ticketIdToDelete} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw new Error('Cannot delete ticket');
        }
    }

    async update(id, newData) {
        try {
            let tickets = await this.getAll();
            const indexToUpdate = tickets.findIndex(ticket => ticket.id === id);

            if (indexToUpdate === -1) {
                throw new Error('Ticket not found');
            }

            tickets[indexToUpdate] = newData;
            await this.writeFile(tickets);

            console.log(`Ticket with ID ${id} updated successfully.`);
            return newData;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw new Error('Cannot update ticket');
        }
    }

}
