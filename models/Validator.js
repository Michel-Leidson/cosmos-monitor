const Sequelize = require('sequelize');
const database = require('../db');
 
const Validator = database.define('validator', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rate:{
        type: Sequelize.DOUBLE,
        defaultValue: null
    },
    max_rate:{
        type: Sequelize.DOUBLE,
        defaultValue: null
    },
    max_change_rate:{
        type: Sequelize.DOUBLE,
        defaultValue: null
    },
    alert_status: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    signer: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    address_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    operator_address: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    consensus_node_address:{
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    missed_blocks: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    moniker: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: false
    },
    jailed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    performance: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    website: {
        type: Sequelize.STRING,
        allowNull: true
    },
    details: {
        type: Sequelize.STRING,
        allowNull: true
    },
    identity: {
        type: Sequelize.STRING,
        allowNull: true
    },
    security_contact: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING
    },
    discord_nickname: {
        type: Sequelize.STRING
    },
    recovering_status: {
        type: Sequelize.STRING
    },
    telegram_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});
 
module.exports = Validator;