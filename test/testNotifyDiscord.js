const notify = require('../service/alert-bot');



async function test(){
    //await notify.notifyJailedValidator("StakePool")
    await notify.notifyChangeValidator({
        moniker: "StakePool",
        max_rate: 0.90000000000,
        details:"This is a mock test",
        rate: 0.2000000000,
        max_change_rate: 0.1000000000
    },"StakePool - TEST MOCK").then(result=>{
        console.log(result)
    })
}

test().catch(err=>{
    console.log(err)
})