const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//This indicates the shape of the documents that will be entering the database
const userCartSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  products: [{
    type: String
  }],
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

userCartSchema.index({ userId: 1 }, { unique: true });

const userCartModel = mongoose.model('UserCart', userCartSchema);

module.exports = userCartModel;
