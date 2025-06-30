const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Get user's cart
router.get('/', (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT c.id, c.quantity, c.createdAt,
           p.id as productId, p.name, p.price, p.image, p.stock
    FROM cart c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ?
    ORDER BY c.createdAt DESC
  `;

  db.all(query, [userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      items: cartItems,
      total: total,
      itemCount: cartItems.length
    });
  });
});

// Add item to cart
router.post('/add', [
  body('productId').isInt().withMessage('Product ID phải là số'),
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    // Check if product exists
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!product) {
        return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
      }

      // Check if product is already in cart
      db.get('SELECT * FROM cart WHERE userId = ? AND productId = ?', [userId, productId], (err, existingItem) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + quantity;
          db.run(
            'UPDATE cart SET quantity = ? WHERE id = ?',
            [newQuantity, existingItem.id],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Không thể cập nhật giỏ hàng' });
              }
              res.json({ message: 'Đã cập nhật số lượng trong giỏ hàng' });
            }
          );
        } else {
          // Add new item
          db.run(
            'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Không thể thêm vào giỏ hàng' });
              }
              res.status(201).json({ message: 'Đã thêm vào giỏ hàng' });
            }
          );
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update/:id', [
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    db.run(
      'UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?',
      [quantity, id, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        res.json({ message: 'Đã cập nhật số lượng' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM cart WHERE id = ? AND userId = ?',
    [id, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }

      res.json({ message: 'Đã xóa khỏi giỏ hàng' });
    }
  );
});

// Clear cart
router.delete('/clear', (req, res) => {
  const userId = req.user.userId;

  db.run('DELETE FROM cart WHERE userId = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  });
});

module.exports = router; 