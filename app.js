import express from 'express';
import mongoose from 'mongoose';
import productRouter from './src/routers/products.routers.js';
import cartRouter from './src/routers/carts.routers.js';
import viewsRouter from './src/routers/views.routers.js';
import sessionViewsRouter from './src/routers/session.views.router.js';
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import cors from 'cors';
import ProductManager from './src/data/productManager.js'

const MONGOURI="mongodb://localhost:27017";
const DBNAME= "ECommerce";
const PORT =8080;

const app = express();
app.use(express.static('src/public'));
app.use(express.json());

app.engine('handlebars', handlebars.engine()); 
app.set('views', './src/views');                
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter); 
app.use('/api/carts', cartRouter); 
app.use('/', viewsRouter);  
app.use('/login', sessionViewsRouter);
app.use(cors()); // enable CORS for all routes
          
try{

    await mongoose.connect(MONGOURI, { dbName: DBNAME } );
    const httpServer= app.listen(PORT,()=>console.log("Server Up")); 
    const socketServer= new Server (httpServer);
    const productManager= new ProductManager('./src/data/products.json');

    socketServer.on('connection', async (clientSocket) => {
        clientSocket.on('productsList', async data => {
            let newData= await productManager.getProducts();
            socketServer.emit('updateProducts', newData);
        });
        clientSocket.on('deletedProduct', async ()=> {
            let newData= await productManager.getProducts(); 
            socketServer.emit('updateProducts', newData);
        });

    });


    /*const products = [
        {
            title: "LaptopI",
            description: "Powerful laptop for professional use",
            code: "LP0099",
            price: 1200,
            stock: 50,
            category: "Electronics",
            thumbnails: ["https://example.com/laptop-thumbnail1.jpg", "https://example.com/laptop-thumbnail2.jpg"]
        },
        {
            title: "Smartphone",
            description: "Flagship smartphone with high-end features",
            code: "SP002",
            price: 800,
            stock: 100,
            category: "Electronics",
            thumbnails: ["https://example.com/smartphone-thumbnail1.jpg", "https://example.com/smartphone-thumbnail2.jpg"]
        },
        {
            title: "Headphones",
            description: "High-quality noise-canceling headphones",
            code: "HD0011",
            price: 150,
            stock: 30,
            category: "Electronics",
            thumbnails: ["https://example.com/headphones-thumbnail1.jpg", "https://example.com/headphones-thumbnail2.jpg"]
        },
        {
            title: "Digital Camera",
            description: "Professional-grade digital camera",
            code: "DC001",
            price: 1000,
            stock: 20,
            category: "Electronics",
            thumbnails: ["https://example.com/camera-thumbnail1.jpg", "https://example.com/camera-thumbnail2.jpg"]
        },
        {
            title: "Gaming Console",
            description: "Latest gaming console with cutting-edge graphics",
            code: "GC001",
            price: 500,
            stock: 50,
            category: "Electronics",
            thumbnails: ["https://example.com/console-thumbnail1.jpg", "https://example.com/console-thumbnail2.jpg"]
        },
        {
            title: "Wireless Mouse",
            description: "Ergonomic wireless mouse for comfortable use",
            code: "WM001",
            price: 50,
            stock: 80,
            category: "Electronics",
            thumbnails: ["https://example.com/mouse-thumbnail1.jpg", "https://example.com/mouse-thumbnail2.jpg"]
        },
        {
            title: "External Hard Drive",
            description: "High-capacity external hard drive for data storage",
            code: "EH001",
            price: 200,
            stock: 40,
            category: "Electronics",
            thumbnails: ["https://example.com/hard-drive-thumbnail1.jpg", "https://example.com/hard-drive-thumbnail2.jpg"]
        },
        {
            title: "Fitness Tracker",
            description: "Smart fitness tracker to monitor your activity",
            code: "FT001",
            price: 80,
            stock: 60,
            category: "Electronics",
            thumbnails: ["https://example.com/fitness-tracker-thumbnail1.jpg", "https://example.com/fitness-tracker-thumbnail2.jpg"]
        },
        {
            title: "Wireless Earbuds",
            description: "Compact wireless earbuds for on-the-go listening",
            code: "WE001",
            price: 100,
            stock: 70,
            category: "Electronics",
            thumbnails: ["https://example.com/earbuds-thumbnail1.jpg", "https://example.com/earbuds-thumbnail2.jpg"]
        },
        {
            title: "Bluetooth Speaker",
            description: "Portable Bluetooth speaker with crisp sound quality",
            code: "BS001",
            price: 120,
            stock: 40,
            category: "Electronics",
            thumbnails: ["https://example.com/speaker-thumbnail1.jpg", "https://example.com/speaker-thumbnail2.jpg"]
        },
        {
            title: "Smartwatch",
            description: "Feature-rich smartwatch with health tracking capabilities",
            code: "SW001",
            price: 300,
            stock: 30,
            category: "Electronics",
            thumbnails: ["https://example.com/smartwatch-thumbnail1.jpg", "https://example.com/smartwatch-thumbnail2.jpg"]
        },
        {
            title: "Electric Toothbrush",
            description: "Advanced electric toothbrush for effective oral care",
            code: "ET001",
            price: 70,
            stock: 50,
            category: "Electronics",
            thumbnails: ["https://example.com/toothbrush-thumbnail1.jpg", "https://example.com/toothbrush-thumbnail2.jpg"]
        },
        {
            title: "Portable Power Bank",
            description: "Compact power bank to charge your devices on the go",
            code: "PB001",
            price: 40,
            stock: 100,
            category: "Electronics",
            thumbnails: ["https://example.com/power-bank-thumbnail1.jpg", "https://example.com/power-bank-thumbnail2.jpg"]
        },
        {
            title: "Wireless Keyboard",
            description: "Sleek wireless keyboard for comfortable typing experience",
            code: "WK001",
            price: 60,
            stock: 60,
            category: "Electronics",
            thumbnails: ["https://example.com/keyboard-thumbnail1.jpg", "https://example.com/keyboard-thumbnail2.jpg"]
        },
        {
            title: "Yoga Mat",
            description: "High-quality yoga mat for comfortable practice",
            code: "YM001",
            price: 30,
            stock: 80,
            category: "Sports & Fitness",
            thumbnails: ["https://example.com/yoga-mat-thumbnail1.jpg", "https://example.com/yoga-mat-thumbnail2.jpg"]
        },
        {
            title: "Resistance Bands",
            description: "Set of resistance bands for strength training",
            code: "RB001",
            price: 25,
            stock: 100,
            category: "Sports & Fitness",
            thumbnails: ["https://example.com/resistance-bands-thumbnail1.jpg", "https://example.com/resistance-bands-thumbnail2.jpg"]
        },
        {
            title: "Tennis Racket",
            description: "Professional-grade tennis racket for precision shots",
            code: "TR001",
            price: 150,
            stock: 30,
            category: "Sports & Fitness",
            thumbnails: ["https://example.com/tennis-racket-thumbnail1.jpg", "https://example.com/tennis-racket-thumbnail2.jpg"]
        },
        {
            title: "Running Shoes",
            description: "Comfortable running shoes for long-distance runs",
            code: "RS001",
            price: 100,
            stock: 50,
            category: "Sports & Fitness",
            thumbnails: ["https://example.com/running-shoes-thumbnail1.jpg", "https://example.com/running-shoes-thumbnail2.jpg"]
        }
    ]


    productModel.insertMany(products)
    .then((docs) => {
        console.log("Products inserted successfully:");
        console.log(docs);
    })
    .catch((err) => {
        console.error("Error inserting products:", err);
    });*/

}catch(error){
    console.log("Server down")
    console.log("Error:" + error);
}