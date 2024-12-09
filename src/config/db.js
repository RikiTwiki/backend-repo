const { Pool } = require('pg');

const pool = new Pool({
  user: 'rikitwiki',
  host: 'localhost',
  database: 'booking',
  password: 'rikitwiki',
  port: 5432,
});

module.exports = pool;