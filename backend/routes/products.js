const express = require('express');
const { db } = require('../database');

const router = express.Router();

// Get all products with filtering
router.get('/', (req, res) => {
  const { category, sort, search } = req.query;
  
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  // Filter by category
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  // Search by name
  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  // Sort by price
  if (sort === 'price-asc') {
    query += ' ORDER BY price ASC';
  } else if (sort === 'price-desc') {
    query += ' ORDER BY price DESC';
  } else {
    query += ' ORDER BY createdAt DESC';
  }

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ products });
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    res.json({ product });
  });
});

// Get categories
router.get('/categories/list', (req, res) => {
  db.all('SELECT DISTINCT category FROM products ORDER BY category', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const categoryList = categories.map(cat => cat.category);
    res.json({ categories: categoryList });
  });
});

module.exports = router; 