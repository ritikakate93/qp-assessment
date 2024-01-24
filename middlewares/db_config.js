const mongoose = require('mongoose');

const connectDB =  () => {
    try {
       mongoose.connect(process.env.MONGO_URI);

  
      console.log('MongoDB Connected...');
    } catch (err) {
      console.error(err.message);
    }
  };
  
  module.exports = connectDB;
