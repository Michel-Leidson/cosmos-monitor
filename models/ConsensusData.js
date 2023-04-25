const Sequelize = require('sequelize'); 
const database = require('../db');

const Proposal = database.define('consensus_data', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    moniker:{
        type: Sequelize.STRING,
        defaultValue: null,
    },
    address:{
        type: Sequelize.STRING,
        defaultValue: null
    },
    status:{
        type: Sequelize.STRING,
        defaultValue: null,
    },
    voting_power: {
        type: Sequelize.NUMBER,
        defaultValue: null
    },
    voting_power_perc: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    voted: {
        type: Sequelize.STRING,
        defaultValue: null,
    }
});

module.exports = Proposal;