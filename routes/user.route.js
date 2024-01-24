const express = require('express');
const router = express.Router();
const GroceryItem = require('../models/GroceryItem');


// View the list of available grocery items
router.get('/grocery-items', async (req, res) => {
  try {
    const items = await GroceryItem.find({ inventory: { $gt: 0 } }, { name: 1, price: 1, inventory: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Ability to book multiple grocery items in a single order
router.post('/orders', async (req, res) => {
  try {
    const { items } = req.body;

    // Check inventory levels
    const insufficientItems = await Promise.all(items.map(async ({ itemId, quantity }) => {
      const item = await GroceryItem.findById(itemId);
      return item.inventory - item.bookedQuantity < quantity ? item.name : null;
    }));

    if (insufficientItems.some(item => item !== null)) {
      res.status(400).json({ error: `Insufficient inventory for: ${insufficientItems.join(', ')}` });
      return;
    }

    // Update booked quantities and create order
    const orderedItems = await Promise.all(items.map(async ({ itemId, quantity }) => {
      const updatedItem = await GroceryItem.findByIdAndUpdate(itemId,
        { $inc: { bookedQuantity: quantity } },
        { new: true }
      );
      return { itemId, quantity, itemName: updatedItem.name };
    }));

    res.status(201).json({ orderedItems });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

module.exports = router;
