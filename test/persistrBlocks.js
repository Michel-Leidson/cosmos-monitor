const BlockRepository = require('../repository/blockRepository');
const { getSignersByBlock } = require('../until')

async function runTest(){
    getSignersByBlock("").then(result=>{
        const height = result.data.result.block.last_commit.height;
        const signatures = result.data.result.block.last_commit.signatures
        signatures.map(block=>{
            try{
                BlockRepository.createBlock({
                    address_key: block.validator_address,
                    signed_in: block.timestamp,
                    height
                })
            }catch{
                console.log("Error on create block")
            }
        })
    })
}

runTest()