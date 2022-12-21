const validatorServices = require('../service/ValidatorService');
const { collectData, populateConsensusNodeAddress } = require('../service/collectValidatorsData');
const { getSignaturesByLastHeight, persistSignatures } = require('../service/BlocksService');
const commissionAnalysis = require("./change_analysis");
const fs = require('fs');
const axios = require('axios');
const { notifyLowPerformanceValidator, notifyRecoveryValidator } = require('./alert-bot');
const COLLECT_INFORMATION_VALIDATORS_INTERVAL = 5;
const WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE = parseInt(process.env.WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE);
const AlertService = require('../service/AlertService')
require('dotenv');

setInterval(async () => {
    
    let blocks_missed = JSON.parse(fs.readFileSync(__dirname + "/../collectedData/block_missed.json").toString())
    blocks_missed.info.map(async validator => {
        validatorServices.updateBlocksMissedByConsensusNodeAddress(validator.address, validator.missedBlocksCounter)
    })
    console.log("Running missed blocks collect")
}, 3 * 1000);


setInterval(async () => {
    collectData().then(result => {
        console.log("Finish collect data!!!")
        console.log("Start populate consensusNodeAddress!!!");
        populateConsensusNodeAddress().then(console.log("Finish populate consensusNodeAddress!!!"))
    }).catch(err => {
        console.log(err.message)
    })
    //updateCheckpointInDatabase();
}, COLLECT_INFORMATION_VALIDATORS_INTERVAL * 1000);


AlertService.start()