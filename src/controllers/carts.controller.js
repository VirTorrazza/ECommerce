import cartModel from "../dao/models/carts.model.js";
import productModel from "../dao/models/products.model.js";
import cartDAOMongo from "../dao/models/cartDAOMongo.js";
import CartsService from "../services/carts.service.js";

const dao= new cartDAOMongo(cartModel);
const service = new CartsService(dao);

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



