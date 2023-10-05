const express = require('express');
const router = express.Router();

const {getAllProducts,createNewProduct,getSingleProduct,updateProduct,deleteProduct,createReview,getAllReviews,deleteReview}=require('../controllers/productControllers');
const {isAuthenticated,authorizeRoles}=require('../middlewares/auth');

router.route('/products')
    .get(getAllProducts);

router.route('/product/:id')
    .get(getSingleProduct);

router.route('/admin/product/new')
    .post(isAuthenticated,authorizeRoles('admin'),createNewProduct);
    
router.route('/admin/product/:id')
    .put(isAuthenticated,authorizeRoles('admin'),updateProduct)
    .delete(isAuthenticated,authorizeRoles('admin'),deleteProduct);
 
router.route('/review')
    .put(isAuthenticated,createReview);

router.route('/reviews')
    .get(isAuthenticated,getAllReviews)
    .delete(isAuthenticated,deleteReview);

module.exports = router;