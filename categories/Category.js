const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories',{
    title: {
        type: Sequelize.STRING,
        allowEmpty: false
    },
    slug: {
        type: Sequelize.STRING,
        allowEmpty: false
    }
})

Category.sync({force: false});

module.exports = Category;