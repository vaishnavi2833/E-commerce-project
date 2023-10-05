const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler');
const mongoose=require('mongoose')
const catchAsyncErrors=require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

//create new products  =>/api/v1/admin/product/new
const createNewProduct = catchAsyncErrors(async(req,res,next) =>{
    req.body.user = req.user.id;
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

    const resultsPerPage= 4;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(),req.query)
                                .search()
                                .filter()
                                .pagination(resultsPerPage);
                                    
    const products = await apiFeatures.query;
    res.status(201).json({success:true,productsCount,count:products.length,products})
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

//create new review => /api/v1/review
const createReview = catchAsyncErrors(async(req,res,next) =>{
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    if(isReviewed){
        product.reviews.forEach(review =>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc,item)=>item.rating + acc,0)/product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({success:true})
})

//get all reviews => /api/v1/reviews
const getAllReviews = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.query.id);
    res.status(200).json({success:true,reviews:product.reviews})
})

//delete review => /api/v1/reviews
const deleteReview = catchAsyncErrors(async(req,res,next) =>{
    const product= await Product.findById(req.query.id);
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString());
    const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc,item)=>item.rating + acc,0)/reviews.length;
    await Product.findByIdAndUpdate(req.query.id,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({success:true})
})

module.exports = {getAllProducts,createNewProduct,getSingleProduct,updateProduct,deleteProduct,createReview,getAllReviews,deleteReview}