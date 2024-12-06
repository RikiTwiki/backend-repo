const pool = require('../config/db'); 
const bcrypt = require('bcryptjs');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password; 
  }

  
  async save() {
    
    const hashedPassword = await bcrypt.hash(this.password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [this.email, hashedPassword]
    );
    this.id = result.rows[0].id; 
    return result.rows[0];
  }

  
  static async findByEmail(email) {
    const result = await pool.query(
        'SELECT id, email, password, role FROM users WHERE email = $1',
        [email]
    );
    if (result.rows.length > 0) {
        const user = new User(result.rows[0].email, result.rows[0].password);
        user.id = result.rows[0].id; 
        user.role = result.rows[0].role; 
        return user;
    } else {
        return null;
    }
  }
}

module.exports = User;