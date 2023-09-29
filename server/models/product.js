const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please enter the product name'],
        trim:true,
        maxLength:[100,'Product name cannot exceed 100 characters']
    },
    price:{
        type:Number,
        required:[true,'Please enter the product name'],
        maxLength:[7,'Product price cannot exceed 7 characters'],
        default: 0.0
    },
    description:{
        type: String,
        required:[true,'Please enter the product description']
    },
    ratings:{
        type:Number,
        required:[true,'Please enter the product name'],
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true,'Please enter a category'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Health/Beauty',
                'Home Essentials',
                'Sports',
                'Outdoor',
                'Food'
            ],
            message: 'Please select correct category for the product'
        }
    },
    seller:{
        type: String,
        required: [true,'Please enter the seller']
    },
    stock:{
        type: Number,
        required:[true,'Please enter the stock available'],
        default: 0
    },
    numofReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            name:{
                type: String,
                required: true
            },
            rating:{
                type:Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    createdAt:{
        type: Date,
        default:Date.now,
    }
})

module.exports=mongoose.model('Product',productSchema)