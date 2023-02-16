const sequelize = require('sequelize');
const { Op } = require('sequelize')
const Proposal = require('../models/Proposal');

async function createProposal(proposal){
    try{
        const resultQuery = await Proposal.create(proposal);
        console.log("Chegou aqui")
    }catch(err){
        console.log("errors in fields: " + err);
        throw err;
    }
}

async function getProposalById(id){
    
    const resultQuery = await Proposal.findOne({
        where: {
            id
        }
    });
    return resultQuery;
}


async function getAllProposals(){
    const resultQuery = await Proposal.findAll();
    return resultQuery;
}

module.exports ={
    createProposal,
    getProposalById,
    getAllProposals
}