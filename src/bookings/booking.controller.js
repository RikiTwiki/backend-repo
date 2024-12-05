const db = require('../config/db'); // Подключение к базе данных

exports.createBooking = async (req, res) => {
    const { roomId, startTime, endTime, reason } = req.body;
    const userId = req.user.userId; // ID пользователя из токена

    if (!roomId || !startTime || !endTime || !reason) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {

        // Преобразуем строку времени в формат ISO (если это необходимо)
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        // Проверка на правильность формата времени
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

        // Если зал свободен, создаём новую запись
        const result = await db.query(
            `INSERT INTO bookings (room_id, user_id, start_time, end_time, reason)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [roomId, userId, startTime, endTime, reason]
        );

        const newBooking = result.rows[0];
        res.status(201).json(newBooking); // Возвращаем созданную запись бронирования
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getBookings = async (req, res) => {
    const userId = req.user.userId; // ID пользователя из токена
    const isAdmin = req.user.role === 'admin'; // Проверка, является ли пользователь администратором
    const page = parseInt(req.query.page) || 1; // Пагинация, по умолчанию на первой странице
    const pageSize = 10; // Количество записей на страницу
    const offset = (page - 1) * pageSize; // Вычисление смещения для SQL запроса

    try {
        let query, queryParams;

        if (isAdmin) {
            // Админ видит все бронирования с подробностями зала и email пользователя
            query = `SELECT b.id, b.room_id, b.start_time, b.end_time, b.reason, r.name as room_name, r.description, u.email as user_email
                     FROM bookings b
                     JOIN rooms r ON b.room_id = r.id
                     JOIN users u ON b.user_id = u.id
                     ORDER BY b.start_time DESC
                     LIMIT $1 OFFSET $2`;
            queryParams = [pageSize, offset];
        } else {
            // Стандартный пользователь видит только свои бронирования с подробностями зала
            query = `SELECT b.id, b.room_id, b.start_time, b.end_time, b.reason, r.name as room_name, r.description
                     FROM bookings b
                     JOIN rooms r ON b.room_id = r.id
                     WHERE b.user_id = $1
                     ORDER BY b.start_time DESC
                     LIMIT $2 OFFSET $3`;
            queryParams = [userId, pageSize, offset];
        }

        const result = await db.query(query, queryParams); // Выполнение запроса к базе данных

        console.log("Bookings Data:", result.rows);

        res.status(200).json(result.rows); // Возвращение списка бронирований в формате JSON
    } catch ( error ) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' }); // Обработка ошибок при запросе
    }
};