const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        stock INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Cart table
      db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      )`);

      // Orders table
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`);

      // Insert sample data
      insertSampleData();
    });

    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const insertSampleData = () => {
  // Sample products
  const sampleProducts = [
    {
      name: 'Áo thun nam basic',
      description: 'Áo thun nam chất liệu cotton 100%, thoáng mát, dễ mặc',
      price: 150000,
      category: 'quần áo',
      image: '/images/ao-thun-nam.jpg',
      stock: 50
    },
    {
      name: 'Quần jean nam slim fit',
      description: 'Quần jean nam kiểu dáng slim fit, chất liệu denim cao cấp',
      price: 450000,
      category: 'quần áo',
      image: '/images/quan-jean-nam.jpg',
      stock: 30
    },
    {
      name: 'Giày sneaker nam',
      description: 'Giày sneaker nam phong cách thể thao, đế cao su bền bỉ',
      price: 800000,
      category: 'giày dép',
      image: '/images/giay-sneaker-nam.jpg',
      stock: 25
    },
    {
      name: 'Ví da nam',
      description: 'Ví da nam thật, thiết kế đơn giản, phù hợp công sở',
      price: 350000,
      category: 'ví',
      image: '/images/vi-da-nam.jpg',
      stock: 20
    },
    {
      name: 'Túi xách nữ',
      description: 'Túi xách nữ thời trang, chất liệu vải bền đẹp',
      price: 280000,
      category: 'túi xách',
      image: '/images/tui-xach-nu.jpg',
      stock: 15
    }
  ];

  sampleProducts.forEach(product => {
    db.run(
      'INSERT OR IGNORE INTO products (name, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [product.name, product.description, product.price, product.category, product.image, product.stock]
    );
  });
};

module.exports = {
  db,
  initDatabase
}; 