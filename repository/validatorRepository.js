
const sequelize = require('sequelize');
const { Op } = require('sequelize')
const Validator = require('../models/Validator');
require('dotenv').config()

const WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE = parseInt(process.env.WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE);
const MAX_LIMIT_LOW_PERFORMANCE = WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE * 0.95;
const MIN_LIMIT_LOW_PERFORMANCE = WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE * 0.05;
console.log('WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE:',WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE)

console.log('MAX_LIMIT_LOW_PERFORMANCE:',MAX_LIMIT_LOW_PERFORMANCE)

console.log('MIN_LIMIT_LOW_PERFORMANCE:',MIN_LIMIT_LOW_PERFORMANCE)

async function createValidator(validator) {
    try {
        const resultQuery = await Validator.create(validator);
    } catch (error) {
        console.log("Errors in fields: " + error);
        throw error
    }
}

async function updateBlocksMissedByConsensusNodeAddress(consensus_node_address, missed_blocks) {
    
    try {
        const resultQuery = await Validator.findOne({
            where: {
                consensus_node_address
            }
        });

        if (resultQuery) {
            resultQuery.missed_blocks = missed_blocks;
            resultQuery.save();
        } else {
            return null
        }
    } catch {

    }
}

async function getLowPerformanceValidators() {
    try {
        const resultQuery = await Validator.findAll({
            where: {
                missed_blocks: {
                    [Op.between]: [MIN_LIMIT_LOW_PERFORMANCE,MAX_LIMIT_LOW_PERFORMANCE]
                }
            }

        });

        return resultQuery;
    } catch {
        console.log("Error in getLowPerformanceValidators")
    }
}

async function getValidatorByDiscordNickname(discord_nickname){
    const resultQuery = await Validator.findOne({
        where: {
            discord_nickname
        }
    });
    if (resultQuery) {
        return resultQuery;
    }
    return null;
}

async function getValidatorByMoniker(moniker) {
    const resultQuery = await Validator.findOne({
        where: {
            moniker: {
                [Op.like]: `%${moniker}%`
            },
            status: "BOND_STATUS_BONDED"
        }
    });
    if (resultQuery) {
        return resultQuery;
    }
    return null;
}

async function updateConsensusNodeAddressByOperatorAddress(operator_address, consensus_node_address) {
    const resultQuery = await Validator.findOne({
        where: {
            operator_address
        }
    })
    if (resultQuery) {
        resultQuery.consensus_node_address = consensus_node_address;
        resultQuery.save();
    }
    return null;
}

async function updateDiscordNicknameByOperatorAddress(operator_address, discord_nickname) {
    const resultQuery = await Validator.findOne({
        where: {
            operator_address
        }
    })
    if (resultQuery) {
        resultQuery.discord_nickname = discord_nickname;
        resultQuery.save();
    }
    return null;
}

async function getValidatorByAddressKey(address_key) {

    const resultQuery = await Validator.findOne({
        attributes: { exclude: ['createdAt', "updatedAt", "email", "telegram_id"] },
        where: {
            address_key: address_key
        }
    });
    return resultQuery

}

async function getValidatorByOperatorAddress(operator_address) {
    const resultQuery = await Validator.findOne({
        attributes: { exclude: ['createdAt', "updatedAt", "email", "telegram_id", "id"] },
        where: {
            operator_address
        }
    });
    return resultQuery
}

async function getValidatorByConsensusNodeAddress(consensus_node_address) {
    const resultQuery = await Validator.findOne({
        attributes: { exclude: ['createdAt', "updatedAt", "email", "telegram_id"] },
        where: {
            consensus_node_address
        }
    });
    return resultQuery
}

async function getValidatorBySigner(signer) {

    const resultQuery = await Validator.findOne({
        where: {
            signer
        }
    });
    return resultQuery

}

async function getAllValidators() {
    const resultQuery = await Validator.findAll(
        {
            attributes: { exclude: ['createdAt', "updatedAt", "email", "telegram_id", "id"] },
            order: [['address_key', 'ASC']],
            where: {
                status: "BOND_STATUS_BONDED"
            }
        }
    );
    return resultQuery
}

async function getAllNotJailedValidators() {
    const resultQuery = await Validator.findAll(
        {
            attributes: { exclude: ['createdAt', "updatedAt", "email", "telegram_id", "id"] },
            order: [['address_key', 'ASC']],
            where: { status: "BOND_STATUS_BONDED", jailed: false }
        }
    );
    return resultQuery

}


async function getAllPerformanceValidators() {
    const resultQuery = await Validator.findAll({
        attributes: ['address_key', 'name', 'performance'],
        order: [['performance', 'DESC'], ['address_key', 'ASC']]
    });
    return resultQuery
}

async function updateValidator(address_key, newValidatorInfo) {
    const resultQuery = await Validator.findOne({
        where: {
            address_key
        }
    })
    if (resultQuery) {
        resultQuery.set(newValidatorInfo)
        resultQuery.save();
    }
    return null;
}

async function updateValidatorPerformance(address_key, performance) {
    const resultQuery = await Validator.findOne({
        where: {
            address_key: address_key
        }
    })
    if (resultQuery) {
        resultQuery.performance = performance;
        resultQuery.save();
    }
    return null;
}

async function updateValidatorSigner(address_key, signer) {
    const resultQuery = await Validator.findOne({
        where: {
            address_key: address_key
        }
    })
    if (resultQuery) {
        resultQuery.signer = signer;
        resultQuery.save();
    }
    return null;
}

async function updateValidatorTelegramId(address_key, telegramId) {
    const resultQuery = await Validator.findOne({
        where: {
            address_key: address_key
        }
    })
    if (resultQuery) {
        resultQuery.telegram_id = telegramId;
        resultQuery.save();
    }
    return null;
}

async function destroyValidatorByAddressKey(address_key) {
    const resultQuery = await Validator.findOne({
        where: {
            address_key: address_key
        }
    })
    if (resultQuery) {
        resultQuery.destroy();
        return resultQuery
    }
    return null;
}

module.exports = {
    createValidator,
    getValidatorByAddressKey,
    updateValidator,
    destroyValidatorByAddressKey,
    getAllValidators,
    updateValidator,
    updateValidatorTelegramId,
    getValidatorBySigner,
    updateValidatorPerformance,
    getAllPerformanceValidators,
    updateValidatorSigner,
    getAllNotJailedValidators,
    updateBlocksMissedByConsensusNodeAddress,
    getValidatorByOperatorAddress,
    updateConsensusNodeAddressByOperatorAddress,
    getValidatorByMoniker,
    getValidatorByConsensusNodeAddress,
    getLowPerformanceValidators,
    updateDiscordNicknameByOperatorAddress,
    getValidatorByDiscordNickname
}