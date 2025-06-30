const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authMiddleware);

// Create order
router.post('/', [
  body('items').isArray().withMessage('Items phải là array'),
  body('total').isFloat({ min: 0 }).withMessage('Total phải là số dương')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, total } = req.body;
    const userId = req.user.userId;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Giỏ hàng trống' });
    }

    // Create order
    db.run(
      'INSERT INTO orders (userId, items, total, status) VALUES (?, ?, ?, ?)',
      [userId, JSON.stringify(items), total, 'pending'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Không thể tạo đơn hàng' });
        }

        const orderId = this.lastID;

        // Clear cart after successful order
        db.run('DELETE FROM cart WHERE userId = ?', [userId], (err) => {
          if (err) {
            console.error('Error clearing cart:', err);
          }
        });

        res.status(201).json({
          message: 'Đặt hàng thành công',
          orderId: orderId,
          order: {
            id: orderId,
            userId,
            items,
            total,
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's orders
router.get('/', (req, res) => {
  const userId = req.user.userId;

  db.all(
    'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Parse items JSON for each order
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }));

      res.json({ orders: ordersWithItems });
    }
  );
});

// Get order by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.get(
    'SELECT * FROM orders WHERE id = ? AND userId = ?',
    [id, userId],
    (err, order) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!order) {
        return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
      }

      // Parse items JSON
      const orderWithItems = {
        ...order,
        items: JSON.parse(order.items)
      };

      res.json({ order: orderWithItems });
    }
  );
});

// Update order status (for admin use)
router.put('/:id/status', [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Status không hợp lệ')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    // Check if user is admin or order owner
    db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Only admin can update order status
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Không có quyền cập nhật đơn hàng' });
      }

      db.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
          }

          res.json({ message: 'Đã cập nhật trạng thái đơn hàng' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 