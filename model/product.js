const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    subType:{
        type:String,
        required:false
    },
    brand:{
        type: String,
        required: true
    },
    connection:{
        type:String,
        required:false

    },
})

//This indicates the shape of the documents that will be entering the database
const productSchema = new Schema({
    
    name: {
        type: String,
        required: true
      },

    categories: {
        type: categorySchema,
        required: true
        
    },

    type: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    isBestSeller: {
        type: Boolean,
        required: false
    },
    description: {
        type: String,
        required: true
    },

    images: [{ type: String }],

    dateCreated: {
        type: Date,
        default: Date.now()
    },
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;