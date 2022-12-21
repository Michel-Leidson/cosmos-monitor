const validatorService = require('../service/ValidatorService');
const link = require("../collectedData/operationAddresLink.json");


async function test(){
    link.map(async info=>{
        const { operator_address, consensus_node_address} = info;
        console.log(operator_address,consensus_node_address)
        validatorService.updateConsensusNodeAddressByOperatorAddress(operator_address,consensus_node_address)
    })
}

test()