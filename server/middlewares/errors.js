const ErrorHandler = require('../utils/errorHandler');
require('dotenv').config();

const errorMiddleware = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    
    if(process.env.NODE_ENV==='DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errorMessage:err.message,
            stack:err.stack
        })
    }

    if(process.env.NODE_ENV==='PRODUCTION'){
        let error={...err};
        error.message=err.message;

        res.status(err.statusCode).json({
            success:false,
            message:err.message || 'Internal Server Error'
        })
    }
    
}
module.exports = errorMiddleware;