import express from 'express';
import MongoClient from './src/utils/MongoClient.js';
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
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import config from './src/config/config.js';
import MessagesService from './src/services/messages.service.js';
import ProductsService from './src/services/products.service.js';
import logger from './src/logger/logger.js';
import loggerRouter from './src/routers/logger.router.js';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";


const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: 'ECommerce Application',
            description: 'Ecommerce app where users can browse, shop, and manage purchases, enhancing their online shopping experience'
        }
    },
    apis: ['./docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOptions);

const PORT =config.apiserver.port;

const app = express();
app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/documentation', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
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
app.use ('/logs', loggerRouter)
app.use(cors()); // enable CORS for all routes

          
try{
    let client =new MongoClient();
    client.connect();
    const httpServer= app.listen(PORT,()=>logger.info("Server Up")); 
    const socketServer= new Server (httpServer);
    let messageService= new MessagesService();
    let productService= new ProductsService();
    //const productManager= new ProductManager('./src/data/products.json');

    socketServer.on('connection', async (clientSocket) => {
        clientSocket.on('message', async (data)=>{
            let newMessage=data;
            let result= await messageService.create(newMessage.user,newMessage.message);
            let logs= await messageService.getAll();
            socketServer.emit('logs', logs);

        })
        clientSocket.on('productsList', async data => {

            let newData= await productService.getAll();
            socketServer.emit('updateProducts', newData);
       });
       // clientSocket.on('deletedProduct', async ()=> {
           // let newData= await productManager.getProducts(); 
            //socketServer.emit('updateProducts', newData);
        });

   // });


}catch(error){
    logger.error("Server down");
}