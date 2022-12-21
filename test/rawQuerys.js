const RawQuery = require("../service/RawQuerys");
const CommissionChangeRepository = require("../repository/commissionChangeRepository")

async function test(){
    const count = await RawQuery.getCountLast30DaysChangeCommissionByValidatorAddressKey("LeqPtVZw591tL7XcUkxDOeMc9spQdQMLqepMc+kgY0Y=");
    console.log(count)

}

test()