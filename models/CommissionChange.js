const Sequelize = require('sequelize');
const database = require('../db');
 
const CommissionChange = database.define('commission_change', {
    
    address_key: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    old_value: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    new_value: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    changed_in: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: new Date().toISOString()
    }
});
 
module.exports = CommissionChange;