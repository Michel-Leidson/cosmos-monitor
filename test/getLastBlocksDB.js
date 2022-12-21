const BlocksService = require('../service/BlocksService');

async function test(){

    const signedBlocks = await BlocksService.getNumberOfLastSignedBlocks("471465719973077C0F77B0939403031999A388C5")
    console.log(signedBlocks)
}

test()