const express = require('express');
const router = express.Router();
const { db } = require('../database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.user && req.user.userId) {
    db.get('SELECT role FROM users WHERE id = ?', [req.user.userId], (err, user) => {
      if (err || !user) return res.status(403).json({ error: 'Không có quyền truy cập' });
      if (user.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới được phép' });
      next();
    });
  } else {
    res.status(401).json({ error: 'Chưa xác thực' });
  }
}

// --- Quản lý khách hàng ---
router.get('/customers', authMiddleware, isAdmin, (req, res) => {
  db.all("SELECT id, email, name, createdAt FROM users WHERE role = 'user'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    // Thêm trường status và location giả lập cho mỗi user
    const customers = rows.map(u => ({
      ...u,
      status: 'subscribed', // hoặc random
      location: 'Việt Nam' // hoặc random
    }));
    res.json({ customers });
  });
});

router.get('/customers/:id', authMiddleware, isAdmin, (req, res) => {
  const id = req.params.id;
  db.get("SELECT id, email, name, createdAt FROM users WHERE id = ? AND role = 'user'", [id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    user.status = 'subscribed';
    user.location = 'Việt Nam';
    res.json({ user });
  });
});

router.get('/customers/:id/payments', authMiddleware, isAdmin, (req, res) => {
  const id = req.params.id;
  db.all('SELECT id, items, total, status, createdAt FROM orders WHERE userId = ?', [id], (err, orders) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    res.json({ payments: orders });
  });
});

router.delete('/customers/:id', authMiddleware, isAdmin, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM users WHERE id = ? AND role = 'user'", [id], function(err) {
    if (err) return res.status(500).json({ error: 'Lỗi xóa khách hàng' });
    // Xóa các đơn hàng và cart liên quan
    db.run('DELETE FROM orders WHERE userId = ?', [id]);
    db.run('DELETE FROM cart WHERE userId = ?', [id]);
    res.json({ message: 'Đã xóa khách hàng và dữ liệu liên quan' });
  });
});

router.post('/customers', authMiddleware, isAdmin, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu thông tin' });
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    if (user) return res.status(400).json({ error: 'Email đã tồn tại' });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hashed, name, 'user'], function(err) {
      if (err) return res.status(500).json({ error: 'Không thể tạo customer' });
      res.json({ customer: { id: this.lastID, email, name, role: 'user' } });
    });
  });
});

// --- Quản lý thành viên ---
router.get('/members', authMiddleware, isAdmin, (req, res) => {
  db.all("SELECT id, email, name, role, createdAt FROM users WHERE role IN ('admin', 'staff')", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    res.json({ members: rows });
  });
});

router.post('/members/invite', authMiddleware, isAdmin, async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ error: 'Thiếu email hoặc tên' });
  // Tạo mật khẩu ngẫu nhiên
  const password = crypto.randomBytes(6).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hashedPassword, name, 'staff'], function(err) {
    if (err) return res.status(500).json({ error: 'Không thể mời thành viên' });
    res.json({ member: { id: this.lastID, email, name, role: 'staff', password } }); // trả về password để gửi cho thành viên
  });
});

router.delete('/members/:id', authMiddleware, isAdmin, (req, res) => {
  const id = req.params.id;
  db.get('SELECT role FROM users WHERE id = ?', [id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Không thể xóa admin' });
    db.run('DELETE FROM users WHERE id = ? AND role = "staff"', [id], function(err) {
      if (err) return res.status(500).json({ error: 'Lỗi xóa thành viên' });
      res.json({ message: 'Đã xóa thành viên' });
    });
  });
});

// --- Cài đặt tài khoản admin ---
router.get('/admin/profile', authMiddleware, isAdmin, (req, res) => {
  const id = req.user.userId;
  db.get('SELECT id, email, name, role, createdAt FROM users WHERE id = ? AND role = "admin"', [id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy admin' });
    res.json({ user });
  });
});

router.put('/admin/profile', authMiddleware, isAdmin, (req, res) => {
  const id = req.user.userId;
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Thiếu tên hoặc email' });
  db.run('UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "admin"', [name, email, id], function(err) {
    if (err) return res.status(500).json({ error: 'Lỗi cập nhật profile' });
    res.json({ message: 'Đã cập nhật profile' });
  });
});

router.put('/admin/password', authMiddleware, isAdmin, async (req, res) => {
  const id = req.user.userId;
  const { current, newPassword } = req.body;
  if (!current || !newPassword) return res.status(400).json({ error: 'Thiếu mật khẩu' });
  db.get('SELECT password FROM users WHERE id = ? AND role = "admin"', [id], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Không tìm thấy admin' });
    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    const hashed = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE id = ? AND role = "admin"', [hashed, id], function(err) {
      if (err) return res.status(500).json({ error: 'Lỗi đổi mật khẩu' });
      res.json({ message: 'Đã đổi mật khẩu' });
    });
  });
});

router.put('/admin/avatar', authMiddleware, isAdmin, (req, res) => {
  const id = req.user.userId;
  const { avatar } = req.body;
  if (!avatar) return res.status(400).json({ error: 'Thiếu đường dẫn avatar' });
  db.run('UPDATE users SET avatar = ? WHERE id = ? AND role = "admin"', [avatar, id], function(err) {
    if (err) return res.status(500).json({ error: 'Lỗi cập nhật avatar' });
    res.json({ message: 'Đã cập nhật avatar' });
  });
});

router.delete('/admin', authMiddleware, isAdmin, (req, res) => {
  const id = req.user.userId;
  db.run('DELETE FROM users WHERE id = ? AND role = "admin"', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Lỗi xóa tài khoản admin' });
    res.json({ message: 'Đã xóa tài khoản admin' });
  });
});

// --- Cài đặt thông báo ---
router.get('/admin/notifications', authMiddleware, isAdmin, (req, res) => {
  const userId = req.user.userId;
  db.get('SELECT * FROM notifications WHERE userId = ?', [userId], (err, noti) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
    if (!noti) {
      // Nếu chưa có thì tạo mặc định
      db.run('INSERT INTO notifications (userId) VALUES (?)', [userId], function(err) {
        if (err) return res.status(500).json({ error: 'Lỗi tạo mặc định' });
        db.get('SELECT * FROM notifications WHERE userId = ?', [userId], (err, noti2) => {
          if (err) return res.status(500).json({ error: 'Lỗi truy vấn database' });
          res.json({ notifications: noti2 });
        });
      });
    } else {
      res.json({ notifications: noti });
    }
  });
});

router.put('/admin/notifications', authMiddleware, isAdmin, (req, res) => {
  const userId = req.user.userId;
  const { email, desktop, product_updates, weekly_digest, important_updates } = req.body;
  db.run(
    'UPDATE notifications SET email = ?, desktop = ?, product_updates = ?, weekly_digest = ?, important_updates = ? WHERE userId = ?',
    [email ? 1 : 0, desktop ? 1 : 0, product_updates ? 1 : 0, weekly_digest ? 1 : 0, important_updates ? 1 : 0, userId],
    function(err) {
      if (err) return res.status(500).json({ error: 'Lỗi cập nhật thông báo' });
      res.json({ message: 'Đã cập nhật cài đặt thông báo' });
    }
  );
});

module.exports = router; 