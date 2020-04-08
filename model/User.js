const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

//This indicates the shape of the documents that will be entering the database
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type:{
    type:String,
    required:false
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

userSchema.index(
  {
    email: 1
  },
  {
    unique: true
  }
);

userSchema.pre("save", function(next) {
  //salt random generated characters or strings
  bcrypt
    .genSalt(10)
    .then(salt => {
      bcrypt
        .hash(this.password, salt)
        .then(encryptPassword => {
          this.password = encryptPassword;
          next();
        })
        .catch(err => console.log(`Error occured when hashing ${err}`));
    })
    .catch(err => console.log(`Error occured when salting ${err}`));
});

const userModel = mongoose.model('User', userSchema);

 module.exports = userModel;