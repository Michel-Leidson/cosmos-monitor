const { getValidatorSignerKey } = require("../until");
const validatorService = require('../service/ValidatorService');

async function test(){
    await getValidatorSignerKey().then(response=>{

        let validatorsData = response.data.result.validators;
        validatorsData.map(async validator=>{
            console.log(validator.address)
            console.log(validator.pub_key.value+"\n")
            
            const key = validator.pub_key.value;
            let vali = await validatorService.getValidatorByAddressKey(key)
            if(vali){
                validatorService.updateValidatorSigner(key,validator.address)
                const teste = await validatorService.getValidatorByAddressKey(key)
                console.log(teste.moniker + " update signer key!")
            }
        })
    }).then(err=>{
        console.log(err)
    })
    
}

test()