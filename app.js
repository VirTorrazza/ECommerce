import express from 'express'
import productRouter from './src/routers/products.routers.js';
import cartRouter from './src/routers/carts.routers.js';

const app = express();
app.use(express.json());
app.use('/products', productRouter); // ruta que va a usar
app.use('/api/carts', cartRouter); // ruta que va a usar

app.listen(8080,()=>console.log("Server Up")); 