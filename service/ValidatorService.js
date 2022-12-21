const ValidatorRepository = require('../repository/validatorRepository');
const notify = require('../service/alert-bot');
const changeAnalysis = require('../service/change_analysis');


const WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE = parseInt(process.env.WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE);
const JAILED_BLOCKS_LIMIT = WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE * 0.5;
const RECOVERY_LIMIT = WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE * 0.05;

console.log('WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE:',WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE)
console.log('JAILED_BLOCKS_LIMIT:',JAILED_BLOCKS_LIMIT)

async function updateValidatorTelegramId(validatorId, telegramId) {
    try {
        await ValidatorRepository.updateValidatorTelegramId(validatorId, telegramId);
    } catch (err) {
        console.log("Error saving telegramId in database!!!\n" + err.message);
    }
}

async function updateBlocksMissedByOperatorAddress(consensus_node_address, missed_blocks) {
    try {
        await ValidatorRepository.updateBlocksMissedByOperatorAddress(operator_address, missed_blocks)
    } catch {
        console.log("Error in updateBlocksMissedByOperatorAddress")
    }
}

async function getValidatorByMoniker(moniker) {
    return await ValidatorRepository.getValidatorByMoniker(moniker);
}

async function getValidatorByDiscordNickname(discord_nickname) {
    return await ValidatorRepository.getValidatorByDiscordNickname(discord_nickname);
}

async function getValidatorByMonikerOrDiscordNickname(validatorIdentifier) {
    let validator =  await ValidatorRepository.getValidatorByMoniker(validatorIdentifier);
    if(validator !== null){
        return validator;
    }else{
        validator = await ValidatorRepository.getValidatorByDiscordNickname(validatorIdentifier);
        return validator;
    }
}

async function updateBlocksMissedByConsensusNodeAddress(consensus_node_address, missed_blocks) {
    try {
        const validator = await getValidatorByConsensusNodeAddress(consensus_node_address);
        if(validator){
            const { moniker,alert_status, missed_blocks , discord_nickname,status,jailed} = validator;
            console.log(`[ ${moniker} ]`,"Missed blocks:",missed_blocks,"Alert status:",alert_status,"JAILED:",jailed)
            if(alert_status!==null && alert_status!=='JAILED' && jailed === false && status==='BOND_STATUS_BONDED' && missed_blocks < RECOVERY_LIMIT){                
                notify.notifyRecoveryValidator({
                    moniker,
                    missed_blocks,
                    discord_nickname
                });
                validator.alert_status = null; 
                validator.save();   
            }            
        }
    } catch (err) {
        console.log("Error in notify performance low", err.message)

    }

    try {
        await ValidatorRepository.updateBlocksMissedByConsensusNodeAddress(consensus_node_address, missed_blocks)
    } catch {
        console.log("Error in updateBlocksMissedByOperatorAddress")
    }

    
}

async function createValidator(moniker, address_key, email, status, rate, max_rate, max_change_rate, jailed, operator_address, website, details, security_contact, identity) {
    try {

        await ValidatorRepository.getValidatorByAddressKey(address_key).then(async result => {

            if (result) {
                changeAnalysis.run({
                    status,
                    moniker,
                    rate,
                    address_key,
                    website,
                    details,
                    security_contact,
                    identity,
                    jailed
                }, result).catch(err => {
                    console.log("error")
                });
            } else {
                
                    await ValidatorRepository.createValidator({
                        moniker,
                        address_key,
                        email,
                        status,
                        rate,
                        max_rate,
                        max_change_rate,
                        jailed,
                        operator_address,
                        website,
                        details,
                        security_contact,
                        identity
                    });
                    notify.notifyNewValidator({
                        moniker,
                        address_key,
                        email,
                        status,
                        rate,
                        max_rate,
                        max_change_rate,
                        jailed,
                        operator_address,
                        website,
                        details,
                        security_contact,
                        identity
                    }).catch(err => {
                        console.log("Error in notify Webhook Discord", err.message)
                    })
                

            }
        })

    } catch (err) {
        console.log(err);
    }
}

async function updateDiscordNicknameByOperatorAddress(operator_address, discord_nickname){
    return await ValidatorRepository.updateDiscordNicknameByOperatorAddress(operator_address, discord_nickname);
}

async function getAllValidators() {
    return await ValidatorRepository.getAllValidators();
}

async function getAllNotJailedValidators() {
    return await ValidatorRepository.getAllNotJailedValidators();
}

async function getAllValidatorsMonitoring() {
    return await ValidatorRepository.getAllValidatorsMonitoring();
}

async function getValidatorByAddressKey(address_key) {
    return await ValidatorRepository.getValidatorByAddressKey(address_key);
}

async function getValidatorBySigner(signer) {
    return await ValidatorRepository.getValidatorBySigner(signer);
}

async function getValidatorByConsensusNodeAddress(consensus_node_address) {
    return await ValidatorRepository.getValidatorByConsensusNodeAddress(consensus_node_address);
}

async function getValidatorByOperatorAddress(operator_address) {
    return await ValidatorRepository.getValidatorByOperatorAddress(operator_address);
}

async function updateConsensusNodeAddressByOperatorAddress(operator_address, consensus_node_address) {
    return await ValidatorRepository.updateConsensusNodeAddressByOperatorAddress(operator_address, consensus_node_address);
}

async function updateValidatorByMaticId(validatorId, missedCheckpoints) {
    return await ValidatorRepository.updateValidator(validatorId, missedCheckpoints);
}

async function updatePerformance(validatorId, performance) {
    return await ValidatorRepository.updateValidatorPerformance(validatorId, performance);
}

async function getAllPerformanceValidators() {
    return await ValidatorRepository.getAllPerformanceValidators();
}

async function destroyValidatorByAddressKey(address_key) {
    return await ValidatorRepository.destroyValidatorByAddressKey(address_key);
}

async function updateValidatorSigner(address_key, signer) {
    return await ValidatorRepository.updateValidatorSigner(address_key, signer)
}

async function getLowPerformanceValidators(){
    return await ValidatorRepository.getLowPerformanceValidators();
}

module.exports = {
    createValidator,
    getValidatorByAddressKey,
    getAllValidators,
    updateValidatorByMaticId,
    updateValidatorTelegramId,
    getValidatorBySigner,
    updatePerformance,
    getAllPerformanceValidators,
    getAllValidatorsMonitoring,
    destroyValidatorByAddressKey,
    updateValidatorSigner,
    getAllNotJailedValidators,
    updateBlocksMissedByConsensusNodeAddress,
    updateBlocksMissedByOperatorAddress,
    getValidatorByOperatorAddress,
    updateConsensusNodeAddressByOperatorAddress,
    getValidatorByMoniker,
    getValidatorByConsensusNodeAddress,
    getLowPerformanceValidators,
    updateDiscordNicknameByOperatorAddress,
    getValidatorByDiscordNickname,
    getValidatorByMonikerOrDiscordNickname
}