const validatorServices = require('../service/ValidatorService');
const { notifyLowPerformanceValidator } = require('./alert-bot');
const ALERT_ANALISIS_INTERVAL_IN_SECONDS = 60;
const WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE = parseInt(process.env.WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE);
require('dotenv');

console.log('WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE:',WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE)

async function start() {

    setInterval(async () => {
        try {
            const validators = await validatorServices.getLowPerformanceValidators();
            validators.map(validator => {
                const { moniker, missed_blocks, alert_status, discord_nickname, recovering_status , jailed } = validator;
                const performance = 100 - ((missed_blocks * 100) / WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE)
                console.log(moniker, "Performance:", `${performance}%`, `Alert Status:${alert_status}`, `Recovering Status:${recovering_status}`,)

                if (`${alert_status}` !== '95' && performance < 95 && performance >= 93 && jailed === false) {

                    let current_recovering_status;
                    if (alert_status !== null) {
                        const alert_status_number = parseInt(alert_status);
                        if (alert_status_number > performance) {
                            current_recovering_status = "<"
                            validator.recovering_status = current_recovering_status
                        } else {
                            current_recovering_status = ">"
                            validator.recovering_status = current_recovering_status
                        }
                    } else {
                        current_recovering_status = "<"
                        validator.recovering_status = current_recovering_status
                    }
                    notifyLowPerformanceValidator(moniker, performance, '95', discord_nickname, current_recovering_status)

                    validator.alert_status = '95'
                    validator.save()
                }
                if (`${alert_status}` !== '85' && performance <= 87 && performance >= 83 && jailed === false) {
                    let current_recovering_status;
                    if (alert_status !== null) {
                        const alert_status_number = parseInt(alert_status);
                        if (alert_status_number > performance) {
                            current_recovering_status = "<"
                            validator.recovering_status = current_recovering_status
                        } else {
                            current_recovering_status = ">"
                            validator.recovering_status = current_recovering_status
                        }
                    } else {
                        current_recovering_status = "<"
                        validator.recovering_status = current_recovering_status
                    }
                    notifyLowPerformanceValidator(moniker, performance, '85', discord_nickname, current_recovering_status)
                    validator.alert_status = '85'
                    validator.save()
                }
                if (`${alert_status}` !== '75' && performance <= 77 && performance >= 73 && jailed === false) {
                    let current_recovering_status;
                    if (alert_status !== null) {
                        const alert_status_number = parseInt(alert_status);
                        if (alert_status_number > performance) {
                            current_recovering_status = "<"
                            validator.recovering_status = current_recovering_status
                        } else {
                            current_recovering_status = ">"
                            validator.recovering_status = current_recovering_status
                        }
                    } else {
                        current_recovering_status = "<"
                        validator.recovering_status = current_recovering_status
                    }
                    notifyLowPerformanceValidator(moniker, performance, '75', discord_nickname, current_recovering_status)
                    validator.alert_status = '75'
                    validator.save()
                }
                if (`${alert_status}` !== '65' && performance <= 67 && performance >= 63 && jailed === false) {
                    let current_recovering_status;
                    if (alert_status !== null) {
                        const alert_status_number = parseInt(alert_status);
                        if (alert_status_number > performance) {
                            current_recovering_status = "<"
                            validator.recovering_status = current_recovering_status
                        } else {
                            current_recovering_status = ">"
                            validator.recovering_status = current_recovering_status
                        }
                    }
                    else {
                        current_recovering_status = "<"
                        validator.recovering_status = current_recovering_status
                    }
                    notifyLowPerformanceValidator(moniker, performance, '65', discord_nickname, current_recovering_status)
                    validator.alert_status = '65'
                    validator.save()
                }
                if (`${alert_status}` !== '55' && performance <= 57 && performance >= 53 && jailed === false) {
                    let current_recovering_status;
                    if (alert_status !== null) {
                        const alert_status_number = parseInt(alert_status);
                        if (alert_status_number > performance) {
                            current_recovering_status = "<"
                            validator.recovering_status = current_recovering_status
                        } else {
                            current_recovering_status = ">"
                            validator.recovering_status = current_recovering_status
                        }
                    } else {
                        current_recovering_status = "<"
                        validator.recovering_status = current_recovering_status
                    }
                    notifyLowPerformanceValidator(moniker, performance, '55', discord_nickname, current_recovering_status)
                    validator.alert_status = '55'
                    validator.save()
                }
            })

        } catch (err) {
            console.log(err)
        }

    }, ALERT_ANALISIS_INTERVAL_IN_SECONDS * 1000)

}

module.exports = {
    start
}
