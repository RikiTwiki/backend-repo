const User = require('./user.model'); 

async function findOneByEmail(email) {
  return User.findOne({ where: { email } });
}

module.exports = {
  findOneByEmail
};