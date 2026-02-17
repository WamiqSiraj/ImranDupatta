import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productName: {type: String, required: true, trim: true},
    productDescription: {type: String, required: true, trim: true},
    productPrice: {type: String, required: true, trim: true},
    fabric: {type: String, required: true, trim: true},
    productImg: [{
        url: {type: String, required: true},
        public_id: {type: String, required: true}
    }],
    category: {
        type: String,
        required: true,
        enum: ['Abaya', 'Hijab', 'Dupatta', 'Shawl', 'Stoller', 'Kids']
    },
    collection: {
        type: String,
        required: true,
        enum: ['New Arrival', 'Eid Special', 'Daily Basis', 'Winter', 'Summer', 'Spring', 'Autumn']
    }
    
},{timestamps: true})

const Product = mongoose.model('Product', productSchema)
export default Product;