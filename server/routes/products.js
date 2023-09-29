const express = require('express');
const router = express.Router();

const {getAllProducts,createNewProduct,getSingleProduct,updateProduct,deleteProduct}=require('../controllers/productControllers');

router.route('/products')
    .get(getAllProducts);

router.route('/product/:id')
    .get(getSingleProduct);

router.route('/admin/product/new')
    .post(createNewProduct);
    
router.route('/admin/product/:id')
    .put(updateProduct)
    .delete(deleteProduct);
 
module.exports = router;