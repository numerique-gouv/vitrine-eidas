const { enable, info } = require('diary');

const active = () => enable('*');
const consigne = info;

module.exports = { active, consigne };
