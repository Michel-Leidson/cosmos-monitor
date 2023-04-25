const validatorServices = require('../service/ValidatorService');
const { collectData, populateConsensusNodeAddress } = require('../service/collectValidatorsData');
const { collectProposalsData } = require('../service/collectProposalsData');
const { collectConsensusData } = require('../service/collectConsensusData');
const { getSignaturesByLastHeight, persistSignatures } = require('../service/BlocksService');
const commissionAnalysis = require("./change_analysis");
const fs = require('fs');
const axios = require('axios');
const { notifyLowPerformanceValidator, notifyRecoveryValidator } = require('./alert-bot');
const COLLECT_INFORMATION_VALIDATORS_INTERVAL = 5;
const WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE = parseInt(process.env.WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE);
const AlertService = require('../service/AlertService')
require('dotenv');

// Coleta os dados dos validadores e insere o endereço de consenso
setInterval(async () => {
    collectData().then(result => {
        console.log("Finish collect data!!!");
        console.log("Start populate consensusNodeAddress!!!");
        populateConsensusNodeAddress().then(console.log("Finish Populate consensusNodeAddress!!!"))
    }).catch(err => {
        console.log(err.message)
    })

}, COLLECT_INFORMATION_VALIDATORS_INTERVAL * 1000);

// Atualiza a quant. de blocos perdidos;
 setInterval(async () => {
    
     let data = fs.readFileSync(__dirname + "/../collectedData/block_missed.json", 'utf8');
     blocks_missed = JSON.parse(data);  
     blocks_missed.info.map(async validator => {
         // console.log(validator.address, validator.missedBlocksCounter);
         validatorServices.updateBlocksMissedByConsensusNodeAddress(validator.address, validator.missedBlocksCounter)
     })
     console.log("Running missed blocks collect")
 }, 3 * 1000);



setInterval(async () => {
    collectProposalsData().then(result => {
        console.log("Finish collect proposals data!!!")
        // console.log("Start populate consensusNodeAddress!!!");
        // populateConsensusNodeAddress().then(console.log("Finish populate consensusNodeAddress!!!"))
    }).catch(err => {
        console.log(err.message)
    })
    //updateCheckpointInDatabase();
}, COLLECT_INFORMATION_VALIDATORS_INTERVAL * 1000);
setInterval(async () => {
    collectConsensusData().then(result => {
        console.log("Finish collect consensus data!!!")
        // console.log("Start populate consensusNodeAddress!!!");
        // populateConsensusNodeAddress().then(console.log("Finish populate consensusNodeAddress!!!"))
    }).catch(err => {
        console.log(err.message)
    })
    //updateCheckpointInDatabase();
}, COLLECT_INFORMATION_VALIDATORS_INTERVAL * 1000);



AlertService.start()