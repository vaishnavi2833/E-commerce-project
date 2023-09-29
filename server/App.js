const express = require('express');
const app= express();
const connectDB =require('./db/connect')
require('dotenv').config();
const errorMiddleware=require('./middlewares/errors')



// Setting up Middlewares
app.use(express.json());


const port=process.env.PORT || 5000;
const server = app.listen((port),()=>{
    console.log(`Server is listening at port ${port} ...`)
    connectDB();
});

//handling unhandles promise rejections
process.on('unhandledRejection',err =>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down server due to unhandled promise rejections');
    server.close(()=>{
        process.exit(1);
    })
})


// Import all routes
const router = require('./routes/products')
app.use('/api/v1/',router)
//middleware to handle errors
app.use(errorMiddleware)


