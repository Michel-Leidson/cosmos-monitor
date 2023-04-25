const sequelize = require('sequelize');
const { Op } = require('sequelize');
const fs = require('fs');
const ConsensusData = require('../models/ConsensusData');

async function createConsensusData(consensusData){
    try{
        const resultQuery = await ConsensusData.create(consensusData);
    }catch(err){
        console.log("errors in fields: " + err);
        throw err;
    }
}

async function getConsensusDataByAddress(address){
    // console.log("verificando se consensus data já existe!");
    const resultQuery = await ConsensusData.findOne({
        where: {
            address
        }
    });
    console.log(resultQuery)
    return resultQuery;
}


async function getConsensus(){
    console.log("função getConsensus..");
    let data = fs.readFileSync('./collectedData/consensus.json', 'utf8');
    let consensusData = JSON.parse(data);
    const resultQuery = await ConsensusData.findAll();
    const response = {
        height: consensusData.height,
        step: consensusData.step,
        round: consensusData.round,
        online_validators: consensusData.online_validators,
        total_validators: consensusData.total_validators,
        consensusData: resultQuery,
        
    }
    return response;
}

module.exports ={
    createConsensusData,
    getConsensusDataByAddress,
    getConsensus
}