
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const Block = require('../models/Block');

const ANALYSIS_WINDOW_SIZE = 5000;

async function createBlock(block) {
    try {
        const resultQuery = await Block.create(block);
    } catch (error) {
        console.log("Error in create Block: " + error.message);
    }
}

async function getLastBlockByAddressKey(address_key) {

    const resultQuery = await Block.findOne({
        attributes: { exclude: ['createdAt', "updatedAt"] },
        where: {
            address_key
        },
        order: [['height', 'DESC']]

    });
    return resultQuery

}

async function getNumberOfLastSignedBlocks(address_key) {
    try {
        const lastSignedBlock = await Block.findOne({
            order: [['height', 'DESC']]
        })
        const lastBlockHeight = lastSignedBlock.height;
        const firstBlockHeight = lastBlockHeight - ANALYSIS_WINDOW_SIZE;
        ;
        const resultQuery = await Block.findAll({
            where: {
                address_key,
                height: {
                    [Op.between]: [firstBlockHeight, lastBlockHeight]
                }
            },
            order: [['height', 'DESC']]
        });
        return resultQuery.length
    } catch {
        console.log("Error in getNumberOfLastSignedBlocks");
    }

}

async function getAllBlocksByAddressKey(address_key) {
    const resultQuery = await Block.findAll(
        {
            attributes: { exclude: ['createdAt', "updatedAt"] },
            order: [['signed_in', 'ASC']],
            where: {
                address_key
            }
        }
    );
    return resultQuery
}

async function destroyBlockByAddressKey(address_key) {
    const resultQuery = await Block.findOne({
        where: {
            address_key
        }
    })
    if (resultQuery) {
        resultQuery.destroy();
        return resultQuery
    }
    return null;
}

module.exports = {
    destroyBlockByAddressKey,
    getAllBlocksByAddressKey,
    getLastBlockByAddressKey,
    createBlock,
    getNumberOfLastSignedBlocks
}