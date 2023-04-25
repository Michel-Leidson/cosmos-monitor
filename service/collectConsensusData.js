const fs = require('fs');


const consensusService = require('./ConsensusService');
async function collectConsensusData() {

    try {
        
        let data = fs.readFileSync('./collectedData/consensus.json', 'utf8')
        let consensusData = JSON.parse(data);
        /*
        const api = axios.create({
            baseURL: `https://celestia.api.explorers.guru/api/validators`
        })*/
        //const { data } = await api.get()
        console.log("Collecting Consensus Data...")
        //await data.validators.map(validator => {
        await consensusData.response.map(consensusLine => {
            const moniker = consensusLine.moniker;
            const address = consensusLine.address;
            const status = consensusLine.status;
            const voting_power = consensusLine.voting_power;
            const voting_power_perc = consensusLine.voting_power_perc;
            const voted = consensusLine.voted;


            consensusService.createConsensusData(moniker, address, status, voting_power, voting_power_perc, voted);
        })

        
    } catch (err) {
        console.error(err)
    }


}

module.exports = {
    collectConsensusData
}