const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler');
const mongoose=require('mongoose')
const catchAsyncErrors=require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

//create new products  =>/api/v1/admin/product/new
const createNewProduct = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.create(req.body)
    res.status(201).json({ success:true,product})
    
})

//get a single product => /api/v1/product/:id
const getSingleProduct =  catchAsyncErrors(async(req,res,next) =>{
    
    const productId = req.params.id;
    // Check if productId is a valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(new ErrorHandler('Invalid Product ID', 400));
    }
    const product =await Product.findById(productId);
    if(!product){
        next(new ErrorHandler('Product Not Found',404))
    }
    res.status(200).json({product})
})

//get all products => /api/v1/products?keyword=givenstring
const getAllProducts = catchAsyncErrors(async (req,res,next)=>{
    const apiFeatures = new APIFeatures(Product.find(),req.query)
                                .search()
                                .filter();
                                    
    const products = await apiFeatures.query;
    res.status(201).json({success:true,count:products.length,products})
})

//update a product => /api/v1/admin/product/:id
const updateProduct = catchAsyncErrors(async (req, res, next) => {

    const productId = req.params.id;
    // Check if productId is a valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler('Invalid Product ID', 400));
    }

    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }
    product = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ product });
    
});


//Delete a product => /api/v1/admin/product/:id
const deleteProduct = catchAsyncErrors(async(req,res,next) =>{
   
    const productId = req.params.id;
    // Check if productId is a valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler('Invalid Product ID', 400));
    }
    const product =await Product.findById(productId);
    if(!product){
        next(new ErrorHandler('Product Not Found',404));
    }
    await product.deleteOne();
    res.status(200).json({message: 'product removed successfully'});
    
})

module.exports = {getAllProducts,createNewProduct,getSingleProduct,updateProduct,deleteProduct}