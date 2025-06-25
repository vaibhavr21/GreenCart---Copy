import cookieParser from 'cookie-parser';
import path from 'path';
import express from 'express';
import cors from  'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebHooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;
const _dirname = path.resolve();


// allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://greencart-yaok.onrender.com'
];

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebHooks)

//middleware configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get("/",(req, res)=> res.send("Api is working"));
app.use("/api/user",userRouter)
app.use("/api/seller",sellerRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)

// Serve static files
app.use(express.static(path.join(_dirname, "/client/dist")));

// Handle React Router - catch all handler: send back React's index.html file
app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

await connectDB();
await connectCloudinary();

app.listen(port, ()=>{
    console.log("server is running on port", port);
})