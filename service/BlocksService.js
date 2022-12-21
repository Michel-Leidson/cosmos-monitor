const BlockRepository = require('../repository/blockRepository');
const { getSignersByBlock } = require('../until')


async function getSignaturesByHeight(heightQuery) {

    try {
        const result = await getSignersByBlock(heightQuery)
        const height = result.data.result.block.last_commit.height;
        const signatures = result.data.result.block.last_commit.signatures
        return {
            height,
            signatures
        };
    } catch(err) {
        console.log(err.message)
    }
}

async function runFirstGetSignaturesByLastHeight() {
    const lastBlockSignatures = await getSignaturesByLastHeight();
    const lastHeight = lastBlockSignatures.height;
    for (let i = lastHeight; i > lastHeight - 5000; i--) {
        console.log(lastHeight, i)
        const signaturesSpecificHeight = await getSignaturesByHeight(lastHeight);
        const { signatures, height } = signaturesSpecificHeight;
        persistSignatures(signatures, height)
    }
}

async function getSignaturesByLastHeight() {
    try {
        let result = await getSignersByBlock("");
        const height = result.data.result.block.last_commit.height;
        const signatures = result.data.result.block.last_commit.signatures;

        return {
            height,
            signatures
        };
    } catch {
        throw new Error("Error in getSignaturesByLastHeight")
    }
}

async function getNumberOfLastSignedBlocks(address_key) {
    try {
        const signedBlocks = await BlockRepository.getNumberOfLastSignedBlocks(address_key);
        return signedBlocks;
    } catch {

    }
}

async function persistSignatures(signatures, height) {
    signatures.map(block => {
        try {
            BlockRepository.createBlock({
                address_key: block.validator_address,
                signed_in: block.timestamp,
                height
            })
        } catch {
            console.log("Error on create block")
        }
    })
}

module.exports = {
    getSignaturesByLastHeight,
    getSignaturesByHeight,
    persistSignatures,
    getNumberOfLastSignedBlocks,
    runFirstGetSignaturesByLastHeight
}