const Sequelize = require('sequelize');
const database = require('../db');

const Proposal = database.define('proposal', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title:{
        type: Sequelize.STRING,
        defaultValue: null,
    },
    description:{
        type: Sequelize.STRING,
        defaultValue: null,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: null
    }
});

module.exports = Proposal;