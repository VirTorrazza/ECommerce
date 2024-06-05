export default  class UserDTO{

    constructor (user){ //standarized user related data exchange
        this.firstName= user.firstName; 
        this.email= user.email;
        this.role= user.role;
        this.age =user.age;
    }
}