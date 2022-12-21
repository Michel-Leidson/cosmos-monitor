const { getValidators } = require("../until");
const validatorsData = require('../collectedData/valida.json');
const validatorServices = require('../service/ValidatorService');


async function test(){
    
    validatorsData.validators.map(validator=>{
        console.log("Address: "+validator.consensus_pubkey.key)
        console.log("Jailed: "+validator.jailed)
        console.log("Moniker: "+validator.description.moniker)
        console.log("Status: "+validator.status)
        console.log("Operator Address:",validator.operator_address,"\n");

        const key = validator.consensus_pubkey.key;
        const moniker = validator.description.moniker;
        const status = validator.status;
        const email = validator.description.security_contact;
        const rate = validator.commission.commission_rates.rate;
        const max_rate = validator.commission.commission_rates.max_rate;
        const max_change_rate = validator.commission.commission_rates.max_change_rate;
        const jailed = validator.jailed;
        const operator_address = validator.operator_address;


        validatorServices.createValidator(moniker,key,email,status,rate,max_rate,max_change_rate,jailed,operator_address)
    })
}

test()