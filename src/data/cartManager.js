import fs from 'fs';
import ProductManager from './productManager.js';
 
class CartManager {

    #carts;
    #path;
    #productManager;

    constructor(path){
        this.#path = path;
        this.#fileInit();
        this.#productManager = new ProductManager('./src/data/products.json');
    }

    getPath(){
        return this.#path;
    }

    #generateID(){
        if(this.#carts.length === 0) return 1;

        return this.#carts[this.#carts.length-1].id + 1;
    }

    async #fileInit(){
        if(!this.#fileExists()){
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, '\t'));
        }
    }

    #fileExists = () => {
        return fs.existsSync(this.#path);
    }

    async createCart(){
        
        if(!this.#fileExists()) return 'Error - File error';
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        this.#carts = JSON.parse(data);

        const newCart = {id: this.#generateID(), products: []};
        this.#carts.push(newCart);

        await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, '\t'));
        
        return newCart;
    }

    async getCartById(id){
        if(!this.#fileExists()) return 'Error - File error';
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        this.#carts = JSON.parse(data);
        let cart = this.#carts.find((cart) => cart.id === id);
        if (!cart) return 'Error - Cart not found';
        return cart;

    }

    async addProductCartById(cid, pid){
        if(!this.#fileExists()) return 'Error - File error';
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        this.#carts = JSON.parse(data);
        let pidI=parseInt(pid)
        let cidI=parseInt(cid)
        let cart = this.#carts.find((cart) => cart.id === cidI);
        if(!cart) {
            return 'Error - Cart Not Found';    
        }
        let product = await this.#productManager.getProductById(pidI);
        if(typeof product === 'string') {
            return 'Error - Product Not Found';    
        }
      
        let productToAdd= cart.products.find((prod)=>prod.product===pidI);
        if(!productToAdd){
            cart.products.push({ product: pidI, quantity: 1 });
        }
        else{
            productToAdd.quantity++;
        }
        
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, '\t')); 
        return cart;
    }

}
export default CartManager