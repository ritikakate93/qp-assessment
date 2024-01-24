const mongoose = require('mongoose');


const groceryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      inventory: {
        type: Number,
        required: true,
      },
      bookedQuantity: {
        type: Number,
        default: 0,
      },
});


module.exports =   mongoose.model('GroceryItem', groceryItemSchema);