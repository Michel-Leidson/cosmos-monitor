const sequelize = require('sequelize');
const CommissionChange = require('../models/CommissionChange');

async function createCommissionChange(commission_change) {
    try {
        const resultQuery = await CommissionChange.create(commission_change);
    } catch (error) {
        console.log("Error in create Block: " + error.message);
    }
}

async function allChanges(){
    
        try {
            const resultQuery = await CommissionChange.findAll()
            return resultQuery
        } catch (error) {
            console.log("Error in create Block: " + error.message);
        }
    
}

module.exports={
    createCommissionChange,
    allChanges
}