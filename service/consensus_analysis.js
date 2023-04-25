const notify = require("../service/alert-bot");

async function run(consensusLineInfo, consensusLineInDB ){

    const oldConsensusLineMoniker = consensusLineInDB.moniker;
    const oldConsensusLineStatus = consensusLineInDB.status;
    const oldConsensusLineVotingPower = consensusLineInDB.voting_power;
    const oldConsensusLineVotingPowerPerc = consensusLineInDB.voting_power_perc;
    const oldConsensusLineVoted = consensusLineInDB.voted;
    try{

        const { moniker, status, voting_power, voting_power_perc, voted } = consensusLineInfo;

        // Possível mudança no nome do validador;
        if(oldConsensusLineMoniker != moniker){
            consensusLineInDB.moniker = moniker;
            consensusLineInDB.save();
        }

        // Possível mudança no status do validador;
        if(oldConsensusLineStatus != status){
            consensusLineInDB.status = status;
            consensusLineInDB.save();
        }

        // Possível mudança no poder de votação do validador;
        if(oldConsensusLineVotingPower != voting_power){
            consensusLineInDB.voting_power = voting_power;
            consensusLineInDB.save();
        }

        // Possível mudança na porcentagem do poder de votação do validador;
        if(oldConsensusLineVotingPowerPerc != voting_power_perc){
            consensusLineInDB.voting_power_perc = voting_power_perc;
            consensusLineInDB.save();
        }

        // Possível mudança na possibilidade de votação do validado;
        if(oldConsensusLineVoted != voting_power_perc){
            consensusLineInDB.voted = voted;
            consensusLineInDB.save();
        }    
        
    }catch (err) {
        console.log("Error", err.message)
    }
    return false;
}

module.exports = { run }