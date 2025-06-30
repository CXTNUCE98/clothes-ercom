const { initDatabase } = require('../database');
const dotenv = require('dotenv');

dotenv.config();

console.log('Initializing database...');

initDatabase()
  .then(() => {
    console.log('Database initialized successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    process.exit(1);
  }); 