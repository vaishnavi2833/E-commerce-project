const connectDB = require('../db/connect');
require('dotenv').config();
const Product = require('../models/product')
const products  =require('../data/product.json')
connectDB();

const seedProducts = async () =>{
    try{
        await Product.deleteMany();
        console.log('Products Deleted');

        await Product.insertMany(products)
        console.log('Products Added');

        process.exit();

    }catch(err){
        console.log(err.message);
        process.exit()
    }
}
seedProducts();