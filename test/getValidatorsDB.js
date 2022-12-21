
const validatorServices = require('../service/ValidatorService');

validatorServices.getAllValidators().then(data => {
    let counter = 0;
    data.map(validator => {
        const validatorObject = JSON.parse(JSON.stringify(validator))
        //console.log(validatorObject)
        counter += 1;
    })

    console.log(counter)
})

validatorServices.getLowPerformanceValidators().then(result=>{
    result.map(teste=>{
        console.log(teste.moniker,teste.missed_blocks)
        console.log(teste.status,"\n")
    })
    
})

validatorServices.getValidatorByDiscordNickname('678055748240146453').then(result=>{
    console.log("Validator:",result)
})