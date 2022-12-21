const { notifyRecoveryValidator } = require('../service/alert-bot');

async function test(){
    const validator = {
        moniker: "This is an TEST Moniker"
    }

    notifyRecoveryValidator(validator);
}
test()