import express from 'express'
import productRouter from './src/routers/products.routers.js';
import cartRouter from './src/routers/carts.routers.js';
import viewsRouter from './src/routers/views.routers.js';
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import cors from 'cors'

const app = express();
app.use(express.static('src/public'));
app.engine('handlebars', handlebars.engine()); 
app.set('views', './src/views');                
app.set('view engine', 'handlebars');
app.use(express.json());
app.use('/products', productRouter); 
app.use('/api/carts', cartRouter); 
app.use('/', viewsRouter);  
app.use(cors()); // enable CORS for all routes
          

const httpServer= app.listen(8080,()=>console.log("Server Up")); 
const socketServer= new Server (httpServer);