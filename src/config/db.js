const { Pool } = require('pg');

const pool = new Pool({
  user: 'rikitwiki',
  host: 'db',
  database: 'booking',
  password: 'rikitwiki',
  port: 5432,
});

module.exports = pool;