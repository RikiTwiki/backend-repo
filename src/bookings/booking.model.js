class Booking {
    static async create(roomId, userId, startTime, endTime, reason) {
        const result = await pool.query(
            'INSERT INTO bookings (room_id, user_id, start_time, end_time, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [roomId, userId, startTime, endTime, reason]
        );
        return result.rows[0];
    }

    static async checkAvailability(roomId, startTime, endTime) {
        const result = await pool.query(
            'SELECT * FROM bookings WHERE room_id = $1 AND (start_time < $3 AND end_time > $2)',
            [roomId, startTime, endTime]
        );
        return result.rows.length > 0;
    }

    static async getBookings(userId, isAdmin) {
        if (isAdmin) {
            return pool.query('SELECT * FROM bookings ORDER BY start_time DESC LIMIT 10');
        } else {
            return pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY start_time DESC LIMIT 10', [userId]);
        }
    }
}