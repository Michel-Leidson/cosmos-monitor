const { getValidatorSignerKey } = require("../until");
const validatorService = require('../service/ValidatorService');
const axios = require('axios')
const fs = require('fs');
const path = require('path')
let validatorsData;
async function updateValidatorsAddressKey() {
    console.log("Update Signer key is running...")
    await getValidatorSignerKey().then(response => {


        let validatorsData = response.data.result.validators;
        validatorsData.map(async validator => {

            const key = validator.pub_key.value;
            let vali = await validatorService.getValidatorByAddressKey(key)
            if (vali) {
                validatorService.updateValidatorSigner(key, validator.address)
                const teste = await validatorService.getValidatorByAddressKey(key)
            }
        })
    }).catch(err => {
        console.log(err)
    })

}

async function collectData() {

    try {
        
        let data = fs.readFileSync('./collectedData/valida.json', 'utf8')
        validatorsData = JSON.parse(data);
        /*
        const api = axios.create({
            baseURL: `https://celestia.api.explorers.guru/api/validators`
        })*/
        //const { data } = await api.get()
        console.log("Collect Data is running...")
        //await data.validators.map(validator => {
        await validatorsData.validators.map(validator => {
            const key = validator.consensusPubkey.key;
            const moniker = validator.description.moniker;
            const status = validator.status;
            const email = validator.description.securityContact;
            const rate = validator.commission.commissionRates.rate;
            const max_rate = validator.commission.commissionRates.maxRate;
            const max_change_rate = validator.commission.commissionRates.maxChangeRate;
            const jailed = validator.jailed;
            const website = validator.description.website;
            const details = validator.description.details;
            const security_contact = validator.description.securityContact;
            const identity = validator.description.identity;
            const operator_address = validator.operatorAddress;

            validatorService.createValidator(moniker, key, email, status, rate, max_rate, max_change_rate, jailed, operator_address, website, details, security_contact, identity)
        })

        await updateValidatorsAddressKey().then(() => {
            console.log("Update Signer key is finished")
        }).catch(err => {
            console.log(err.message)
        })
    } catch (err) {
        console.error(err)
    }


}

async function populateConsensusNodeAddress() {
    try {
        let validatorsConsensusNodeaddres = new Map();

        const api3 = axios.create({
            baseURL: `https://celestia.explorers.guru/validators`
        })
        const dataset = await api3.get();

        dataset.data.map(validator => {
            //validatorsConsensusNodeaddres.set(validator.pub_key.value, validator.address)
            validatorService.updateConsensusNodeAddressByOperatorAddress(validator.operator_address, validator.consensus_address)
        })
        /*
        const api = axios.create({
            baseURL: `https://lcd.bitcanna.io/cosmos/staking/v1beta1/validators?pagination.limit=1000`
        })
        const { data } = await api.get()

        data.validators.map(validator => {
            const consensus_node_address = validatorsConsensusNodeaddres.get(validator.consensus_pubkey.key)
            if (typeof consensus_node_address !== 'undefined') {
                //validatorsPubKey.set(validator.operator_address,consensus_node_address)
                ///logic to persists consensus node address in validator
                validatorService.updateConsensusNodeAddressByOperatorAddress(validator.operator_address, consensus_node_address)
            }
        })*/
    } catch (e) {
        console.log(e)
    }

}

module.exports = {
    collectData,
    populateConsensusNodeAddress
}
