import cartModel from "../dao/models/cart.model.js";
import cartDAOMongo from "../dao/cartDAOMongo.js";
import CartsService from "../services/carts.service.js";
import ProductsService from "../services/products.service.js";
import TicketsService from "../services/tickets.service.js";
import shortid from 'shortid';
import CustomError from "../services/errors/CustomError.js";
import EErros from "../services/errors/EErrors.js";
import logger from "../logger/logger.js";

const dao= new cartDAOMongo(cartModel);
const service = new CartsService(dao);
const productService= new ProductsService()
const ticketService= new TicketsService();

export async function createCart(req, res) {
    try {
        const newCart = await service.createCart();
        logger.debug(`Cart created`);
        return res.status(201).json({ payload: newCart });
    } catch (error) {
        let creationError = CustomError.createError({
            name: "Cart Creation Attempt Failed Error",
            code: EErros.SERVER_ERROR,
            cause: `Internal Server Error`
        });
        logger.error(`Cart creation error in createCart()`);
        return res.status(500).json(creationError);
       
    }
}

export async function getCart (req, res){
    try {
        const cid = req.params.cid;
    
        const cart = await service.getById(cid);
      if (!cart) {
        let error = CustomError.createError({
            name: "Cart Get By ID Error",
            code: EErros.DATABASES_ERROR,
            cause: `Cart with id ${cid} does not exists`
        });
        logger.error(`Cart with ID: ${id} not found`);
        return res.status(400).json( error);
      }
      logger.debug("Successful cart retrieval");
      return res.status(200).json({ payload: cart });
    } catch (error) {
        logger.error(`Error fetching cart: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }

export async function addToCart(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await service.getById(cid);
        if (!cart) {
            let error = CustomError.createError({
                name: "Cart Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Cart with id ${cid} does not exists`
            });
            logger.error(`Error getting cart by ID: ${cid}`);
            return res.status(400).json( error);
        }
        let product= await productService.getById(pid);
        if (!product) {
            let error = CustomError.createError({
                name: "Product Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Product with id ${pid} does not exists`
            });
            logger.error(`Error getting product by ID: ${pid} in cartscontroller`);
            return res.status(400).json( error);
        }

        if(product.owner ===req.user.email){
            logger.error(`User with email: ${req.user.email} cannot buy its own products`);
            return res.status(400).json( error);
        }


        let updatedProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid);

        if (updatedProductIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[updatedProductIndex].quantity += 1;
        }
        const updatedCart = await service.update(cid,cart);
        logger.debug("Cart product added successfully");
        return res.status(200).json({ payload: updatedCart });

    } catch (error) {
        logger.error(`Error fetching cart: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function removeFromCart(req, res) {
    try {
        const cart = await service.getById(req.params.cid);
        
        if (!cart) {
            let error = CustomError.createError({
                name: "Cart Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Cart with id ${req.params.cid} does not exist`
            });
            logger.error(`Error getting cart by ID: ${req.params.cid}`);
            return res.status(400).json(error);
        }

        const searchedProduct = await productService.getById(req.params.pid);

        if (!searchedProduct) {
            let error = CustomError.createError({
                name: "Product Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Product with id ${req.params.pid} does not exist`
            });
            logger.error(`Error getting product by ID: ${req.params.pid} in cartscontroller`);
            return res.status(404).json(error);
        }
        cart.products = cart.products.filter(item => item.product.toString() !== req.params.pid);

        const updatedCart = await service.update(
            cart._id,
            { products: cart.products }
        );

        logger.debug("Cart product removed successfully");
        return res.status(200).json({ payload: updatedCart });

    } catch (error) {
        logger.error(`Error removing from cart: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function clearCart(req, res) {
    try {
        const cart = await service.getById(req.params.cid);
        if (!cart) {
            let error = CustomError.createError({
                name: "Cart Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Cart with id ${req.params.cid} does not exists`
            });
            logger.error(`Cart with ID: ${req.params.cid} does not exists`);
            return res.status(400).json(error);
        }

        cart.products = [];
        const updatedCart = await service.update(
            cart._id,
            { products: cart.products }
        );

        logger.debug("Cart cleaned successfully");
        return res.status(200).json({ payload: updatedCart });

    } catch (error) {
        logger.error(`Error deleting products from cart: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateCart(req, res) {
    try {
        let cart;
        let cid = req.params.cid;

        try {
            cart = await service.getById(cid);
            if (!cart) {
                let error = CustomError.createError({
                    name: "Cart Get By ID Error",
                    code: EErros.DATABASES_ERROR,
                    cause: `Cart with id ${cid} does not exist`
                });
                logger.error(`Error getting cart by ID: ${cid}`);
                return res.status(400).json(error);
            }

        } catch (error) {
            logger.error("Parser Error");
            return res.status(404).json({ error: "404: Parser Error.Cast Error" + error });
        }

        cart.products = req.body.products;
        let result = await service.update(cid,{ products: cart.products });
        logger.debug("Cart updated successfully");
        return res.status(200).json({ payload: result });
    } catch (error) {
        logger.error(`Error updating cart: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function updateCartItem(req, res) {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid; 
        let cart = await service.getById(cid);
        if (!cart) {
            let error = CustomError.createError({
                name: "Cart Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Cart with id ${cid} does not exist`
            });
            logger.error(`Cart with id ${cid} does not exist`);
            return res.status(400).json(error);
        }

        let product= await productService.getById(pid);
        if (!product) {
            let error = CustomError.createError({
                name: "Product Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Product with id ${pid} does not exist`
            });
            logger.error(`Product with id ${pid} does not exist in cartscontroller`);
            return res.status(400).json(error);
        }

        let updatedProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid);

        if (updatedProductIndex === -1) {
            return res.status(404).json({ error: "404: Product not found" });
        }
      
        cart.products[updatedProductIndex].quantity = req.body.quantity;

        let result = await service.update(cid, { products: cart.products });
        logger.debug("Successful cart item update");
        return res.status(200).json({ payload: result });
    } catch (error) {
        logger.error(`Error updating cart item: ${error}`);
        return res.status(500).json({ error: "Internal Server Error: " + error.message });
    }  
}

export async function purchaseItems(req,res){
    try {
        let cid = req.params.cid;
        const cart = await service.getById(cid);
        if (!cart) {
            let error = CustomError.createError({
                name: "Cart Get By ID Error",
                code: EErros.DATABASES_ERROR,
                cause: `Cart with id ${cid} does not exist`
            });
            logger.error(`Error getting cart by ID: ${cid}`);
            return res.status(400).json(error);
        }
    
        let productsToTicket = [];
        let productsAfterPurchase = cart.products;
        let amount = 0;
    
        await Promise.all(cart.products.map(async (item) => {
            const productToPurchase = await productService.getById(item.product);
    
            if (!productToPurchase) {
                logger.error(`Error getting product by ID: ${item.product} in cartscontroller`);
                throw new Error(`Product with id=${item.product} does not exist. Cannot purchase this product`);
            }
    
            if (item.quantity > productToPurchase.stock) { // if cart item purchased quantity > existing item quantity
                logger.error(`Insufficient stock for product with id=${item.product}`);
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
        
        const result = await ticketService.create({
            code: shortid.generate(),
            products: productsToTicket,
            amount,
            purchaser: req.user.email
        })
        logger.debug("Successfull purchase operation");
        return res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        logger.error(`Error at purchase operation: ${err.message}`);
        return res.status(500).json({ status: 'error', error: err.message })
    }
       
}