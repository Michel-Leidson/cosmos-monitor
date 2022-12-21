const validatorService = require('../service/ValidatorService');
const link = require("../collectedData/validators_info.json");


async function test(){
    link.validators.map(async info=>{
        const { operator_address, discord_nickname } = info;
        console.log(operator_address,discord_nickname)
        validatorService.updateDiscordNicknameByOperatorAddress(operator_address,discord_nickname)
    })
}

test()