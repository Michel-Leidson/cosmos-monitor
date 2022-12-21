const axios = require('axios');


function getInstant() {
    return new Date().toISOString();
}



async function getValidatorSignerKey() {
    const api = axios.create({
        baseURL: `https://rpc-1.celestia.nodes.guru/validators?height=&per_page=150`
    })
    return await api.get()
}

async function getSignersByBlock(block) {
    let queryBlock = "";
    if (typeof block !== undefined) {
        console.log(typeof block)
        queryBlock = block;
    }

    const api = axios.create({
        baseURL: `https://mainnet.crypto.org:26657/block?height=${queryBlock}`
    })
    return await api.get()
}

async function getValidators() {
    const api = axios.create({
        baseURL: `https://mainnet.crypto.org:26657/validators`
    })
    return await api.get("/")
}

async function getTransactionBySigner(signer) {
    const api = axios.create({
        baseURL: `https://api.covalenthq.com/v1/137/address/${signer}/transactions_v2/?&key=ckey_1dcff2c7044d4a529f3c33d10ef`
    })
    return await api.get("/")

}

module.exports = {
    getInstant: getInstant,
    getValidators,
    getTransactionBySigner,
    getSignersByBlock,
    getValidatorSignerKey
}