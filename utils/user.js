const gi = require('./gi');
const user = {};

user.getUserInfo = () => {
  return gi(['user', 'email'], (err, result) => {
    const user = result ? result.user : null;
    const email = result ? result.email : null;
    return `${user} <${email}>`;
  });
};

module.exports = user;