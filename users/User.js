const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define( 'users', {
    username: {
        type: Sequelize.STRING,
        allowEmpty: false
    },
    email: {
        type: Sequelize.STRING,
        allowEmpty: false
    },
    password: {
        type: Sequelize.STRING,
        allowEmpty: false
    }
})

User.sync({force: false});

module.exports = User;