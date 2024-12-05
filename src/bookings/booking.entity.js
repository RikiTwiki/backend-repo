const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Booking',
  tableName: 'bookings',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    roomId: {
      name: 'room_id',  // Здесь устанавливается правильное имя столбца
      type: 'int',
      nullable: false,
    },
    userId: {
      name: 'user_id',  // Аналогично, если в БД столбец называется user_id
      type: 'int',
    },
    startTime: {
      name: 'start_time',
      type: 'timestamp',
    },
    endTime: {
      name: 'end_time',
      type: 'timestamp',
    },
    reason: {
      type: 'text',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    room: {
      target: 'Room',
      type: 'many-to-one',
      joinColumn: { name: 'room_id' },  // Указываем имя столбца для внешнего ключа
      nullable: false,
    },
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id' },  // Аналогично для связи с пользователем
      nullable: false,
    },
  },
});