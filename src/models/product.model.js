//product.model-js
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
    winery: {
        type: String, 
        required: true
    },
    wine: {
        type: String, 
        required: true
    },
    location: {
        type: String, 
        required: true
    },
    image: {
        type: String, 
    },
    category: {
        type: String, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    code: {
        type: String, 
        required: true,
        unique: true
    },
    status: {
        type: Boolean, 
        required: true
    },
    thumbnails: {
        type: [String], 
    },
})

productSchema.plugin(paginate);

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;