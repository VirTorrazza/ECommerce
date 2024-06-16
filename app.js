import express from 'express';
import MongoClient from './src/dao/MongoClient.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import productRouter from './src/routers/products.routers.js';
import cartRouter from './src/routers/carts.routers.js';
import viewsRouter from './src/routers/views.routers.js';
import sessionViewsRouter from './src/routers/session.views.router.js';
import sessionRouter from './src/routers/session.router.js';
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import cors from 'cors';
import ProductManager from './src/data/productManager.js';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import config from './src/config/config.js';

const PORT =config.apiserver.port;

const app = express();
app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))

initializePassport(); // Configure passport with custom strategies and settings 
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine()); 
app.set('views', './src/views');                
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter); 
app.use('/api/carts', cartRouter); 
app.use('/',viewsRouter);  
app.use('/login', sessionViewsRouter);
app.use('/api/sessions', sessionRouter);
app.use(cors()); // enable CORS for all routes

          
try{
    let client =new MongoClient();
    client.connect();
    const httpServer= app.listen(PORT,()=>console.log("Server Up")); 
    //const socketServer= new Server (httpServer);
    //const productManager= new ProductManager('./src/data/products.json');

    //socketServer.on('connection', async (clientSocket) => {
        //clientSocket.on('productsList', async data => {
            //let newData= await productManager.getProducts();
            //socketServer.emit('updateProducts', newData);
       // });
       // clientSocket.on('deletedProduct', async ()=> {
           // let newData= await productManager.getProducts(); 
            //socketServer.emit('updateProducts', newData);
        //});

   // });


}catch(error){
    console.log("Server down")
    console.log("Error:" + error);
}