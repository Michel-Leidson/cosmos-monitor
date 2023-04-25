const consensusAnalysis = require('./consensus_analysis');
const consensusDataRepository = require('../repository/consensusDataRepository');

async function createConsensusData(moniker, address, status, voting_power, voting_power_perc, voted) {
    try {

        await consensusDataRepository.getConsensusDataByAddress(address).then(async result => {

            if (result) {
                consensusAnalysis.run({
                    moniker,
                    address,
                    status,
                    voting_power,
                    voting_power_perc,
                    voted,
                }, result).catch(err => {
                    console.log("error")
                });
            } else {
                
                    await consensusDataRepository.createConsensusData({
                        moniker,
                        address,
                        status,
                        voting_power,
                        voting_power_perc,
                        voted,
                    });
                  

            }
        }) 

    } catch (err) {
        console.log(err);
    }
}

async function getConsensus(){
    console.log("função getConsensus..");

    return await consensusDataRepository.getConsensus()
}

module.exports = {
    createConsensusData,
    getConsensus
}