const pool = require('../config/db');

class Room {
    static async getBooked() {
        const result = await pool.query(
            'SELECT rooms.id, rooms.name, rooms.description, bookings.start_time, bookings.end_time, bookings.reason, users.email as booked_by FROM rooms JOIN bookings ON rooms.id = bookings.room_id JOIN users ON bookings.user_id = users.id WHERE bookings.end_time > NOW() AND bookings.start_time <= NOW()'
        );
        return result.rows;
    }

    static async create(name, description) {
        const result = await pool.query(
            'INSERT INTO rooms (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        return result.rows[0];
    }    

    static async update(id, { isBooked, author, bookingTime, reason }) {
        const result = await pool.query(
            `UPDATE rooms SET isbooked = $1, author = $2, bookingtime = $3, reason = $4 WHERE id = $5 RETURNING *`,
            [isBooked, author, bookingTime, reason, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    }

    
    static async getAll() {
        const result = await pool.query('SELECT * FROM rooms');
        return result.rows;
    }

}

module.exports = Room;