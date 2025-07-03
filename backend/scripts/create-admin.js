const bcrypt = require('bcryptjs');
const { db } = require('../database');

async function createAdminUser() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';
  const adminName = 'Admin User';

  try {
    // Check if admin already exists
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return;
      }

      if (user) {
        console.log('Admin user already exists');
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      db.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [adminEmail, hashedPassword, adminName, 'admin'],
        function(err) {
          if (err) {
            console.error('Error creating admin user:', err);
            return;
          }

          console.log('Admin user created successfully!');
          console.log('Email:', adminEmail);
          console.log('Password:', adminPassword);
          console.log('User ID:', this.lastID);
        }
      );
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
createAdminUser(); 