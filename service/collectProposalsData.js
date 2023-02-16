const ProposalsService = require('./ProposalService');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
let proposalsData;

async function collectProposalsData(){
    try{
        let data = fs.readFileSync('./collectedData/proposals.json', 'utf8');
        proposalsData = JSON.parse(data);

        await proposalsData.proposals.map(proposal => {
            const id = proposal.proposalId;
            const title = proposal.content.title;
            const description = proposal.content.description;
            const status = proposal.status;

            ProposalsService.createProposal({ id, title, description, status })

        })
    }catch(error){
        console.error(error);
    }
}

module.exports = { collectProposalsData }