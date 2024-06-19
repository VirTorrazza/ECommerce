import fs from 'fs'

export default class cartDAOFile{
    constructor(){
        this.path='/src/data/users.json';
        this.init();
    }
}