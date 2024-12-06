const RoomModel = require('./room.model'); 
const Room = require('./room.entity'); 
const { AppDataSource } = require('../../data-source'); 

const Booking = require('../bookings/booking.entity');


exports.getBookedRooms = async (req, res) => {
    try {
        const bookedRooms = await RoomModel.getBooked(); 
        res.status(200).json(bookedRooms);
    } catch (error) {
        console.error('Error fetching booked rooms:', error);
        res.status(500).json({ message: 'Error fetching booked rooms' });
    }
};


exports.addRoom = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const room = await RoomModel.create(name, description); 
        res.status(201).json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Error creating room' });
    }
};


exports.bookRoom = async (req, res) => {
    try {
        const { room_id, start_time, end_time, reason } = req.body;

        
        if (!room_id || !start_time || !end_time || !reason) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const bookingRepository = AppDataSource.getRepository(Booking); 

        
        const overlappingBookings = await bookingRepository.query(`
            SELECT * FROM bookings 
            WHERE "room_id" = $1 
            AND "start_time" < $2 AND "end_time" > $3
        `, [room_id, start_time, end_time]);

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ message: 'Room is already booked for the selected time range' });
        }

        console.log({
            roomId: req.body.room_id,
            // userId: req.body.user_id,
            startTime: req.body.start_time,
            endTime: req.body.end_time,
            reason: req.body.reason,
        });

        
        const newBooking = {
            room_id: req.body.room_id,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            reason: req.body.reason,
        }

        console.log("newBooking:", newBooking);

        await bookingRepository.save(newBooking);

        res.status(200).json({ message: 'Room booked successfully', booking: newBooking });
    } catch (error) {
        console.error('Error booking room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getUserBookings = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

      const userRole = req.user.role; 
      const userId = req.user.id; 
  
      const bookingRepository = AppDataSource.getRepository(Booking);
      let bookings;
  
      if (userRole === 'admin') {
        
        bookings = await bookingRepository.find({
          relations: ['room'], 
        });
      } else {
        
        bookings = await bookingRepository.find({
          where: { user_id: userId }, 
          relations: ['room'], 
        });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllRooms = async (req, res) => {
    try {
        const roomRepository = AppDataSource.getRepository(Room); 
        const rooms = await roomRepository.find(); 
        res.status(200).json(rooms); 
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        res.status(500).json({ message: 'Error fetching all rooms' });
    }
};

// // Проверка доступности комнаты
// exports.checkRoomAvailability = async (req, res) => {
//     const { room_id, start_time, end_time } = req.body;
  
//     if (!room_id || !start_time || !end_time) {
//       return res.status(400).json({ message: 'Room ID, start time, and end time are required' });
//     }
  
//     try {
//       const bookingRepository = AppDataSource.getRepository(Booking);
//       const overlappingBookings = await bookingRepository.query(`
//         SELECT * FROM bookings 
//         WHERE "room_id" = $1 
//         AND "start_time" < $2 AND "end_time" > $3
//       `, [room_id, end_time, start_time]);
  
//       const isAvailable = overlappingBookings.length === 0;
//       res.status(200).json({ isAvailable });
//     } catch (error) {
//       console.error('Error checking room availability:', error);
//       res.status(500).json({ message: 'Error checking room availability' });
//     }
//   };
  