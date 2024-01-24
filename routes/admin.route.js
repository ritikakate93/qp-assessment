const express = require('express');
const router = express.Router();
const GroceryItem = require('../models/GroceryItem');


// Admin Endpoints

// Add new grocery item
router.post('/add', async (req, res) => {
    try {
      const newItem = await GroceryItem.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ error: 'Invalid request body' });
    }
});


// View existing grocery items
router.get('/view', async (req, res) => {
    try {
      const items = await GroceryItem.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  
// Remove grocery item
router.delete('/remove/:itemId', async (req, res) => {
    try {
      const deletedItem = await GroceryItem.findByIdAndDelete(req.params.itemId);
      if (!deletedItem) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


  
// Update details of existing grocery item
router.put('/update/:itemId', async (req, res) => {
    try {
      const updatedItem = await GroceryItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
      if (!updatedItem) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json(updatedItem);
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid request body' });
    }
});


// Manage inventory levels
router.patch('/manage-inventory/:itemId', async (req, res) => {
    try {
      const { action, quantity } = req.body;
      let update;
      if (action === 'increment') {
        update = { $inc: { inventory: quantity } };
      } else if (action === 'decrement') {
        update = { $inc: { inventory: -quantity } };
      } else {
        res.status(400).json({ error: 'Invalid action' });
        return;
      }
  
      const updatedItem = await GroceryItem.findByIdAndUpdate(req.params.itemId, update, { new: true });
      if (!updatedItem) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json(updatedItem);
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid request body' });
    }
});


module.exports = router;