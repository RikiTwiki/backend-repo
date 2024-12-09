const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "rikitwiki",
    password: "rikitwiki",
    database: "booking",
    synchronize: false, // Не используйте на production
    logging: true,
    entities: [
        require('./src/rooms/room.entity'), // Подключение через require
        require('./src/users/user.entity'), // Подключение других сущностей
        require('./src/bookings/booking.entity'),
    ],
    migrations: [
        path.join(__dirname, 'src/migration/*.js'),
    ],
});

module.exports = { AppDataSource };