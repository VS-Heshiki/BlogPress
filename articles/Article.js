const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('article',{
    title: {
        type: Sequelize.STRING,
        allowEmpty: false
    },
    body: {
        type: Sequelize.TEXT,
        allowEmpty: false
    },
    slug: { 
        type: Sequelize.STRING,
        allowEmpty: false
    }
})

Category.hasMany(Article);
Article.belongsTo(Category);

Article.sync({force: false});

module.exports = Article;