const BlockRepository = require('../repository/blockRepository');


async function runTest(){
    const blocks = await BlockRepository.getAllBlocksByAddressKey("471465719973077C0F77B0939403031999A388C5")
    const pureBlock = JSON.parse(JSON.stringify(blocks)) 
    console.log(pureBlock)
}
runTest()