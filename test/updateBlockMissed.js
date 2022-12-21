
const blocksMissedInfo = require('../collectedData/block_missed.json');
const ValidatorService = require('../service/ValidatorService');

async function test(){

    blocksMissedInfo.info.map(async validator=>{
        console.log(validator)
        ValidatorService.updateBlocksMissedByConsensusNodeAddress(validator.address,validator.missed_blocks_counter)
    })
}

test()