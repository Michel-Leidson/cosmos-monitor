const { QueryTypes,Op } = require('sequelize');
const sequelize = require('../db');

async function getCountLast30DaysChangeCommissionByValidatorAddressKey(address_key,minutesTimezone) {
    //'SELECT count(checkpointNumber) as CheckpointsCount FROM checkpoints WHERE validator = :id'
    //'SELECT createdAt , count(checkpointNumber) FROM checkpoints WHERE validator = :id GROUP BY createdAt'
    //'SELECT DATE(createdAt) as collectDate , count(checkpointNumber) as checkpointsCount FROM checkpoints WHERE validator = :id GROUP BY collectDate'
    try {
        if(!minutesTimezone){
            minutesTimezone = 0
        }
        const stringTimezone = convertMinutesInStringTimezone(minutesTimezone);
        const datetime = new Date().toISOString()
        const result = await sequelize.query(
            `SELECT COUNT(*) as changesCount  FROM commission_changes WHERE address_key = :address_key AND createdAt > DATETIME("${datetime}","${stringTimezone}","-30 day")`
            /*
            `SELECT t1.checkpointsCount as checkpointsCount, t1.collectDate as collectDate , t2.checkpointsCount as totalCheckpoints
            FROM
            (SELECT DATE(datetime(signed_in,"${stringTimezone}")) as collectDate , count(checkpointNumber) as checkpointsCount FROM checkpoints WHERE validator = :id GROUP BY collectDate) t1
            LEFT JOIN
            (SELECT  DATE(datetime(signed_in,"${stringTimezone}")) as collectDate , count(DISTINCT checkpointNumber) as checkpointsCount FROM checkpoints  GROUP BY collectDate ) t2
            ON t1.collectDate = t2.collectDate            
            GROUP BY t1.collectDate
            ORDER BY t1.collectDate DESC
            LIMIT 30`*/,
            {
                replacements: { address_key },
                type: QueryTypes.SELECT
            }
        );

        return result;
    } catch (err) {
        console.error(err.message);
    }

}

async function getMissedCountCheckpointPerDayByMaticId(validatorId,minutesTimezone) {
    //'SELECT count(checkpointNumber) as CheckpointsCount FROM checkpoints WHERE validator = :id'
    //'SELECT createdAt , count(checkpointNumber) FROM checkpoints WHERE validator = :id GROUP BY createdAt'
    //'SELECT DATE(createdAt) as collectDate , count(checkpointNumber) as checkpointsCount FROM checkpoints WHERE validator = :id GROUP BY collectDate'
    try {
        if(!minutesTimezone){
            minutesTimezone = 0
        }
        const stringTimezone = convertMinutesInStringTimezone(minutesTimezone);
        const result = await sequelize.query(
            
            `SELECT (t2.checkpointsCount - t1.checkpointsCount) as missedCheckpoints, t1.collectDate as collectDate , t2.checkpointsCount as totalCheckpoints
            FROM            
            (SELECT DATE(datetime(signed_in,"${stringTimezone}")) as collectDate , count(checkpointNumber) as checkpointsCount FROM checkpoints WHERE validator = :id GROUP BY collectDate ) t1 
            LEFT JOIN
            (SELECT  DATE(datetime(signed_in,"${stringTimezone}")) as collectDate , count(DISTINCT checkpointNumber) as checkpointsCount FROM checkpoints  GROUP BY collectDate ) t2       
            ON t1.collectDate = t2.collectDate
            GROUP BY t1.collectDate
            ORDER BY t1.collectDate DESC
            LIMIT 30`,
           /*`SELECT  DATE(datetime(signed_in,"${stringTimezone}")) as collectDate , count(DISTINCT checkpointNumber) as checkpointsCount FROM checkpoints  GROUP BY collectDate `,
           */ 
           {
                replacements: { id: validatorId },
                type: QueryTypes.SELECT,
            }
            //
        );

        return result;
    } catch (err) {
        console.error(err.message);
    }

}


function getSignal(timezone) {
    return (timezone < 0) ? "+" : "-"
}

function convertMinutesInStringTimezone(timezoneMinutes) {
    const signal = getSignal(timezoneMinutes);
    const hour = ("00" + parseInt(Math.abs(timezoneMinutes / 60))).slice(-2);
    const minutes = ("00" + Math.abs(timezoneMinutes % 60)).slice(-2);
    return signal + hour + ":" + minutes;
}

async function getBlocksInfoBySignerAddress(signer){
    try {
        const result = await sequelize.query(
            `SELECT t.* FROM (SELECT block,
            CAST((strftime('%s', datetime('now')) - strftime('%s', signed_in)) / (60 * 60 * 24) AS TEXT) || 'd ' ||
            CAST(((strftime('%s', datetime('now')) - strftime('%s', signed_in)) % (60 * 60 * 24)) / (60 * 60) AS TEXT) || 'h ' ||
            CAST((((strftime('%s', datetime('now')) - strftime('%s', signed_in)) % (60 * 60 * 24)) % (60 * 60)) / 60 AS TEXT) || 'm' as age , transactions, gasUsed, reward FROM blocks WHERE signer = :signer LIMIT 50 ) t
            ORDER BY t.block DESC`,
            {
                replacements: { signer: signer },
                type: QueryTypes.SELECT
            }
        );
        //"SELECT block, DATETIME(datetime('now') - datetime(signed_in)) as age, transactions, gasUsed, reward FROM blocks WHERE signer = :signer"
        return result;
    } catch (err) {
        console.error(err.message);
    }
  }

module.exports = {
    getCountLast30DaysChangeCommissionByValidatorAddressKey,
    getBlocksInfoBySignerAddress,
    getMissedCountCheckpointPerDayByMaticId
}