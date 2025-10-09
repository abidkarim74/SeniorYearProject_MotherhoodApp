import mongoose from "mongoose";


const user_schema = new mongoose.Schema({
  username: {
    type: String, 
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
    required: false,
    default: null

  },
  password: {
    type: String,
    required: true,
  }
});


export const User = mongoose.model('User', user_schema);