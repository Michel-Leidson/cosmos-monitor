const proposalsRepository = require('../repository/proposalRepository');
const proposalAnalysis = require('./proposal-analysis');
const notify = require('./alert-bot');


async function createProposal({id, title, description, status}) {
    try {
        await proposalsRepository.getProposalById(id).then(async result => {
        console.log(result)

            if (result) {
                proposalAnalysis.run({
                    id,
                    status,
                    title,
                    description
                }, result).catch(err => {
                    console.log("error")
                });
            } else {
                
                    await proposalsRepository.createProposal({
                        id,
                        title,
                        description,
                        status
                    });
                    notify.notifyNewProposal({
                        id,
                        title,
                        description,
                        status
                    }).catch(err => {
                        console.log("Error in notify Webhook Discord", err.message)
                    })
                

            }
        })
        

    } catch (err) {
        console.log(err);
    }
}

async function getAllProposals(){
    console.log("Pedindo as propostas..")
    return await proposalsRepository.getAllProposals();
}


async function getProposalById(id){
    console.log("Buscando dados da proposta nº " + id);
    return await proposalsRepository.getProposalById(id);
}

module.exports = {
    createProposal,
    getAllProposals,
    getProposalById
}