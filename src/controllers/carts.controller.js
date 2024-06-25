import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import cartDAOMongo from "../dao/cartDAOMongo.js";
import CartsService from "../services/carts.service.js";
import ProductsService from "../services/products.service.js";
import TicketsService from "../services/tickets.service.js";
import shortid from 'shortid';


const dao= new cartDAOMongo(cartModel);
const service = new CartsService(dao);
const productService= new ProductsService()
const ticketService= new TicketsService();

export async function createCart(req, res) {
    try {
        const newCart = await service.createCart();
        return res.status(201).json({ payload: newCart });
    } catch (error) {
        console.error("Error creating cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getCart (req, res){
    try {
        const cid = req.params.cid;
    
        const cart = await service.getById(cid);
      if (!cart) {
        return res.status(404).json({ error: "404: Cart not found" });
      }
      return res.status(200).json({ payload: cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


export async function addToCart(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await service.getById(cid);
        if (!cart) {
            return res.status(404).json({ error: "404: Cart not found" });
        }
        let updatedProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid);

        if (updatedProductIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[updatedProductIndex].quantity += 1;
        }
        const updatedCart = await service.update(cid,cart);
        return res.status(200).json({ payload: updatedCart });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function removeFromCart(req, res) {
    try {
        const cart = await service.getById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "404: Cart not found" });
        }

        const searchedProduct = await productModel.findById(req.params.pid);
        if (!searchedProduct) {
            return res.status(404).json({ error: "404: Product not found" });
        }

        cart.products = cart.products.filter(item => item.product.toString() !== req.params.pid);

        const updatedCart = await service.update(
            cart._id,
            { products: cart.products }
        );

        return res.status(200).json({ payload: updatedCart });
    } catch (error) {
        console.error("Error deleting product from cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function clearCart(req, res) {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "404: Cart not found" });
        }

        cart.products = [];
        const updatedCart = await cartModel.findByIdAndUpdate(
            cart._id,
            { products: cart.products },
            { returnDocument: 'after' }
        );

        return res.status(200).json({ payload: updatedCart });

    } catch (error) {
        console.error("Error deleting products from cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateCart(req, res) {
    try {
        let cart;
        let cid = req.params.cid;

        try {
            cart = await service.update(cid);
            if (!cart) return res.status(404).json({ error: "404: Cart not found" });

        } catch (error) {
            return res.status(404).json({ error: "404: Parser Error.Cast Error" + error });
        }

        cart.products = req.body.products;
        let result = await service.update(cid, cart);
        return res.status(200).json({ payload: result });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function updateCartItem(req, res) {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid; 
        let cart = await service.getById(cid);
        if (!cart) {
            return res.status(404).json({ error: "404: Cart not found" });
        }

        let updatedProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid);

        if (updatedProductIndex === -1) {
            return res.status(404).json({ error: "404: Product not found" });
        }
      
        cart.products[updatedProductIndex].quantity = req.body.quantity;

        let result = await service.update(cid, { products: cart.products });

        return res.status(200).json({ payload: result });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error: " + error.message });
    }

    
}

export async function purchaseItems(req,res){
    try {
        let cid = req.params.cid;
        const cart = await service.getById(cid);
        if (cart === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` });
        }
    
        let productsToTicket = [];
        let productsAfterPurchase = cart.products;
        let amount = 0;
    
        await Promise.all(cart.products.map(async (item) => {
            const productToPurchase = await productService.getById(item.product);
            console.log("productToPurchase" +JSON.stringify(productToPurchase))
    
            if (!productToPurchase) {
                throw new Error(`Product with id=${item.product} does not exist. Cannot purchase this product`);
            }
    
            if (item.quantity > productToPurchase.stock) { // if cart item purchased quantity > existing item quantity
                throw new Error(`Insufficient stock for product with id=${item.product}`);
            }
    
            productToPurchase.stock -= item.quantity;
            await productService.update(productToPurchase._id, { stock: productToPurchase.stock });
    
            productsAfterPurchase = productsAfterPurchase.filter(prod => prod.product.toString() !== item.product.toString());
            amount += (productToPurchase.price * item.quantity);
    
            productsToTicket.push({
                product: productToPurchase._id,
                price: productToPurchase.price,
                quantity: item.quantity
            });
        }));

        await service.update(cid, { products: productsAfterPurchase }); //remaining products
        
        console.log ("SOY EL REQ.USER"+ JSON.stringify(req.user));
        const result = await ticketService.create({
            code: shortid.generate(),
            products: productsToTicket,
            amount,
            purchaser: req.user.email
        })
        return res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        return res.status(500).json({ status: 'error', error: err.message })
    }
       
}