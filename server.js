const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AppDataSource } = require('./data-source'); 

// const bookingRoutes = require('./src/bookings/booking.routes');

// const userRoutes = require('./src/users/user.routes');

const bookingRoutes = require('./src/bookings/booking.routes');
const roomRoutes = require('./src/rooms/room.routes');
const authRoutes = require('./src/auth/auth.routes');
const userRoutes = require('./src/users/user.routes');

const app = express();

// Настройка CORS
const corsOptions = {
    origin: 'http://localhost:8081', // Замените на адрес, с которого будете делать запросы
    optionsSuccessStatus: 200, // некоторые наследуемые браузеры (IE11, различные SmartTV) ограничены 204
  };

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Логируем все входящие запросы
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);  // Логируем запросы
    next();  // Переходим к следующему обработчику
  });


// const authRoutes = require('./src/auth/auth.routes'); // Маршруты для авторизации
// const roomRoutes = require('./src/rooms/room.routes'); // Маршруты для работы с комнатами

app.use('/api/auth', authRoutes); 
app.use('/api', roomRoutes); 

app.use('/api', bookingRoutes);

app.use('/api', userRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Booking App Backend!');
});

// Инициализация TypeORM DataSource
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        const PORT = process.env.PORT || 3000;

        console.log(`Attempting to start server on http://localhost:${PORT}`);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });