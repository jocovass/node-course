const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true, // isn't validator it will just transform the text to lowercase
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'The minimum length for password is 8 charachter.'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same.',
    },
  },
});

userSchema.pre('save', async function (next) {
  // noly run the encryption if the password was modified
  if (!this.isModified('password')) return next();
  // hash the password with cost of 12 and deleted the confirm passowrd
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;
