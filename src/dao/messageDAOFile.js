import fs from 'fs';

export default class MessageDAOFile{
    constructor() {
        this.path = '/src/data/messages.json';
        this.init();
    }
}