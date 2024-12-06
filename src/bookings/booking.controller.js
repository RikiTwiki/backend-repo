const db = require('../config/db'); 

exports.createBooking = async (req, res) => {
    const { roomId, startTime, endTime, reason } = req.body;
    const userId = req.user.userId; 

    if (!roomId || !startTime || !endTime || !reason) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {

        
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Проверка занятости зала
        const conflict = await db.query(
            `SELECT * FROM bookings
             WHERE room_id = $1 AND 
                   (start_time, end_time) OVERLAPS ($2::timestamp, $3::timestamp)`,
            [roomId, startTime, endTime]
        );

        if (conflict.rows.length > 0) {
            return res.status(400).json({ message: 'Room is already booked for this time slot' });
        }

        
        const result = await db.query(
            `INSERT INTO bookings (room_id, user_id, start_time, end_time, reason)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [roomId, userId, startTime, endTime, reason]
        );

        const newBooking = result.rows[0];
        res.status(201).json(newBooking); 
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getBookings = async (req, res) => {
    const userId = req.user.userId; 
    const isAdmin = req.user.role === 'admin'; 
    const page = parseInt(req.query.page) || 1; 
    const pageSize = 10; 
    const offset = (page - 1) * pageSize; 

    try {
        let query, queryParams;

        if (isAdmin) {
            
            query = `SELECT b.id, b.room_id, b.start_time, b.end_time, b.reason, r.name as room_name, r.description, u.email as user_email
                     FROM bookings b
                     JOIN rooms r ON b.room_id = r.id
                     JOIN users u ON b.user_id = u.id
                     ORDER BY b.start_time DESC
                     LIMIT $1 OFFSET $2`;
            queryParams = [pageSize, offset];
        } else {
            
            query = `SELECT b.id, b.room_id, b.start_time, b.end_time, b.reason, r.name as room_name, r.description
                     FROM bookings b
                     JOIN rooms r ON b.room_id = r.id
                     WHERE b.user_id = $1
                     ORDER BY b.start_time DESC
                     LIMIT $2 OFFSET $3`;
            queryParams = [userId, pageSize, offset];
        }

        const result = await db.query(query, queryParams); 

        console.log("Bookings Data:", result.rows);

        res.status(200).json(result.rows); 
    } catch ( error ) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
};