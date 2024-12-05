const User = require('./user.model'); // Предполагается, что модель пользователя уже создана

async function findOneByEmail(email) {
  return User.findOne({ where: { email } });
}

module.exports = {
  findOneByEmail
};