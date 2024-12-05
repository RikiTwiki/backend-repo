// src/users/user.model.js
const pool = require('../config/db'); // Путь к файлу конфигурации базы данных
const bcrypt = require('bcryptjs');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password; // Пароль передается не захешированный
  }

  // Сохранение нового пользователя в базе данных с хешированием пароля
  async save() {
    // Хеширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(this.password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [this.email, hashedPassword]
    );
    this.id = result.rows[0].id; // Сохраняем ID после добавления в базу
    return result.rows[0];
  }

  // Поиск пользователя по email
  static async findByEmail(email) {
    const result = await pool.query(
        'SELECT id, email, password, role FROM users WHERE email = $1',
        [email]
    );
    if (result.rows.length > 0) {
        const user = new User(result.rows[0].email, result.rows[0].password);
        user.id = result.rows[0].id; // Сохраняем ID пользователя
        user.role = result.rows[0].role; // Сохраняем роль пользователя
        return user;
    } else {
        return null;
    }
  }
}

module.exports = User;