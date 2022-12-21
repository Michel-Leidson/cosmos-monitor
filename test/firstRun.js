const BlocksService = require('../service/BlocksService');

async function test(){

    const signedBlocks = await BlocksService.runFirstGetSignaturesByLastHeight()
}

test()