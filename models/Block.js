const Sequelize = require('sequelize');
const database = require('../db');
 
const Block = database.define('block', {
    height: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    address_key: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    signed_in: {
        type: 'TIMESTAMP',
        allowNull: true
    }
});
 
module.exports = Block;