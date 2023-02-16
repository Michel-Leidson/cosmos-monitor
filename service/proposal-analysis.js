const notify = require("../service/alert-bot");

async function run(proposalInfo, proposalInDB ){

    const oldProposalStatus = proposalInDB.status;
    try{
        let statusAlert = false;
        let notifyMessage = {}

        const { status } = proposalInfo

        // NotifyAceptedProposal
        if((oldProposalStatus === 'PROPOSAL_STATUS_UNSPECIFIED' || oldProposalStatus === 'PROPOSAL_STATUS_SUBMITTED') & status === 'PROPOSAL_STATUS_PASSED'){
            notify.NotifyAceptedProposal(proposalInfo);
            proposalInDB.status = 'PROPOSAL_STATUS_PASSED';
            proposalInDB.save();
        }

        // NotifyRejectedProposal
        if((oldProposalStatus === 'PROPOSAL_STATUS_UNSPECIFIED' || oldProposalStatus === 'PROPOSAL_STATUS_SUBMITTED') & status === 'PROPOSAL_STATUS_REJECTED'){
            notify.NotifyRejectedProposal(proposalInfo);
            proposalInDB.status = 'PROPOSAL_STATUS_REJECTED';
            proposalInDB.save();
        }

        // NotifyAbortedProposal
        if((oldProposalStatus === 'PROPOSAL_STATUS_UNSPECIFIED' || oldProposalStatus === 'PROPOSAL_STATUS_SUBMITTED') & status === 'PROPOSAL_STATUS_ABORTED'){
            notify.NotifyAbortedProposal(proposalInfo);
            proposalInDB.status = 'PROPOSAL_STATUS_ABORTED';
            proposalInDB.save();
        }

        // notifyWithdrawalProposal
        if((oldProposalStatus === 'PROPOSAL_STATUS_UNSPECIFIED' || oldProposalStatus === 'PROPOSAL_STATUS_SUBMITTED') & status === 'PROPOSAL_STATUS_WITHDRAWN'){
            notify.notifyWithdrawalProposal(proposalInfo);
            proposalInDB.status = 'PROPOSAL_STATUS_WITHDRAWN';
            proposalInDB.save();
        }

        /*
            PROPOSAL_STATUS_UNSPECIFIED: Valor referente a vazio.
            PROPOSAL_STATUS_SUBMITTED: Valor quando a proposta for enviada para período de votação.
            PROPOSAL_STATUS_PASSED: Proposta aceita.
            PROPOSAL_STATUS_REJECTED: Proposata Recusada.
            PROPOSAL_STATUS_ABORTED: Proposta abortada.
            PROPOSAL_STATUS_WITHDRAWN: proposta retirada antes do período de votação.
        */
        
        
    }catch (err) {
        console.log("Error", err.message)
    }
    return false;
}

module.exports = { run }