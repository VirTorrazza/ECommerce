import fs from 'fs'; 
import logger from '../logger/logger.js';

export default class TicketDAOFile {
    constructor() {
        this.path = '/src/data/tickets.json';
        this.init();
    }

    async init() {
        try {
            if (!fs.access(this.path)) {
                fs.writeFile(this.path, JSON.stringify([]));
                logger.debug(`Created empty file in TicketDAOFile: ${this.path}`);
            }
        } catch (error) {
            logger.error(`Error: ${error}  when initializing ticket data file`);
            throw new Error('Cannot initialize ticket data');
        }
    }

    async readFile() {
        try {
            let data = fs.readFile(this.path, 'utf-8'); 
            logger.debug(`Successfull reading file operation in ticketDAOFile`);
            return JSON.parse(data);
        } catch (error) {
            logger.error(`Reading File Error: ${error}`);
            throw new Error('Cannot read file');
        }
    }

    async getAll() {
        try {
            logger.debug(`awaiting getAll tickets operation`);
            return await this.readFile();
        } catch (error) {
            logger.error(`Error at getting tickets in DAOFile: ${error}`);
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
            logger.debug(`Successfull save ticket operation`);
            return ticket;
        } catch (error) {
            logger.error(`Error when saving ticket in DAOFile: ${error}`);
            throw new Error('Cannot save ticket');
        }
    }

    async writeFile(data) {
        try {
            fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error(`Error ${error} at writing file operation in TicketDAOFile`);
            throw new Error('Cannot write file');
        }
    }

    async delete(ticketIdToDelete) {
        try {
            let tickets = await this.getAll();
            const indexToDelete = tickets.findIndex(ticket => ticket.id === ticketIdToDelete);

            if (indexToDelete === -1) {
                logger.error(`Ticket with ID ${ticketIdToDelete} not found in delete operation`);
                throw new Error('Ticket not found');
            }

            tickets.splice(indexToDelete, 1);
            await this.writeFile(tickets);
            logger.debug(`Ticket with ID ${ticketIdToDelete} deleted successfully.`);
        } catch (error) {
            logger.error(`Error ${error} at delete ticket operation`);
            throw new Error('Cannot delete ticket');
        }
    }

    async update(id, newData) {
        try {
            let tickets = await this.getAll();
            const indexToUpdate = tickets.findIndex(ticket => ticket.id === id);

            if (indexToUpdate === -1) {
                logger.error(`Ticket with ID ${id} not found in update operation`)
                throw new Error('Ticket not found');
            }

            tickets[indexToUpdate] = newData;
            await this.writeFile(tickets);

            logger.debug(`Ticket with ID ${id} updated successfully.`);
            return newData;
        } catch (error) {
            logger.error(`Error ${error} when updating ticket in DAOFile`);
            throw new Error('Cannot update ticket');
        }
    }

}
