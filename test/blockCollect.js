const {getSignersByBlock} = require('../until');

async function runTest(){

    await getSignersByBlock(3276139).then(result=>{
        console.log(result.data.result.block.last_commit.signatures)
    }).then(err=>{
        console.log(err)
    })
}

runTest()