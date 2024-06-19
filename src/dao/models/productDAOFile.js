import fs from 'fs'

export default class productDAOFile{
    constructor(){
        this.path='/src/data/users.json';
        this.init();
    }
}