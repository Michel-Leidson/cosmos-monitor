const axios = require('axios');
const discord = require('discord.js');
require('dotenv').config();

const DISCORD_URL_WEBHOOK = process.env.DISCORD_URL_WEBHOOK;
const NOTIFY_COLOR_MESSAGE = process.env.NOTIFY_COLOR_MESSAGE;

console.log(process.env.DISCORD_URL_WEBHOOK, process.env.NOTIFY_COLOR_MESSAGE)
const api = axios.create({
    baseURL: DISCORD_URL_WEBHOOK
})

async function notifyJailedValidator(validatorMoniker, discord_nickname) {
    console.log(validatorMoniker)
    let discordID = formatUserMentionDiscord(discord_nickname);
    const json = JSON.stringify({

        "username": "Celestia Alert",
        "content": `Mention: ${discordID}`,
        "embeds": [
            {
                "title": `🚫Validator Jailed!`,
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": [
                    {
                        "name": "Moniker",
                        "value": `${validatorMoniker}`
                    }
                ]
            }
        ]
    })
    await api.post("", json, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(err => {
        console.log(err.message)
    })
}

async function notifyNewValidator(validator) {
    console.log("Notify New validator in Discord Bot:", validator.moniker)
    const { moniker, max_rate, rate, max_change_rate, operator_address, website, identity, security_contact, details } = validator;
    let fields = [];

    if (typeof moniker !== 'undefined') {
        fields.push({
            "name": "Moniker",
            "value": `${moniker}`
        })
    }
    if (typeof rate !== 'undefined') {
        fields.push({
            "name": "Rate",
            "value": `${rate}`
        })
    }
    if (typeof max_rate !== 'undefined') {
        fields.push({
            "name": "Max Rate",
            "value": `${max_rate}`
        })
    }
    if (typeof max_change_rate !== 'undefined') {
        fields.push({
            "name": "Max Rate Change",
            "value": `${rate}`
        })
    }

    if (typeof operator_address !== 'undefined') {
        fields.push({
            "name": "Operator Address",
            "value": `${operator_address}`
        })
    }
    if (typeof website !== 'undefined') {
        fields.push({
            "name": "Website",
            "value": `${website}`
        })
    }
    if (typeof security_contact !== 'undefined') {
        fields.push({
            "name": "Security Contact",
            "value": `${security_contact}`
        })
    }
    if (typeof details !== 'undefined') {
        fields.push({
            "name": "Details",
            "value": `${details}`
        })
    }

    fields = removeInvalidCharacters(fields);

    const json = JSON.stringify({
        "username": "Celestia Alert",
        "embeds": [
            {
                "title": "New Validator!",
                "description": "New validator was identified in Celestia Network",
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": fields,
                "thumbnail": {
                    "url": "https://t3.ftcdn.net/jpg/00/90/20/08/240_F_90200846_rAoY6CMRSJ7X8gFJyzyXKYtvxQqK28Lk.jpg"
                }
            }
        ]
    })
    console.log("Send notify change Info to Discord:", json)
    await api.post("", json, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(err => {
        console.log(err);
    })
}

async function notifyLowPerformanceValidator(moniker, performance, alert_status, discord_nickname, recovering_status) {
    let fields = [];
    let signal_recovering="<";
    let title_message="Validator performance is low.";
    if (recovering_status!=='undefined'){
        signal_recovering = recovering_status;
        if(recovering_status==='>'){
            title_message = "Validator is recovering."
            signal_recovering= "\u003E"
        }
    }
    let ICON = `🔴`;
    if (alert_status === '95' || alert_status === '90' || alert_status === '85') {
        ICON = `🟡`
    }
    if (alert_status === '80' || alert_status === '75' || alert_status === '70') {
        ICON = `🟠`
    }
    try {
        if (typeof moniker !== 'undefined') {
            fields.push({
                "name": "Moniker",
                "value": `${moniker}`
            })
        }
        if (typeof alert_status !== 'undefined') {
            fields.push({
                "name": "Performance",
                "value": `\`${signal_recovering} ${alert_status} %\``
            })
        }

        fields = removeInvalidCharacters(fields);
        let discordID = formatUserMentionDiscord(discord_nickname);
        const json = JSON.stringify({
            "username": "Celestia Alert",
            "content": `Mention: ${discordID}`,
            "embeds": [
                {
                    "title": `${ICON} ${title_message}`,
                    "color": NOTIFY_COLOR_MESSAGE,
                    "fields": fields
                }
            ]
        });

        await api.post("", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch {

    }
}

async function notifyRecoveryValidator(validator) {

    try {
        console.log("Notify change validator in Discord Bot:", validator)
        const { status, missed_blocks, moniker, changesCount, max_rate, rate, max_change_rate, operator_address, website, identity, security_contact, details, discord_nickname } = validator;
        let fields = [];
        if (typeof moniker !== 'undefined') {
            fields.push({
                "name": "Moniker",
                "value": `${moniker}`
            })
        }

        fields = removeInvalidCharacters(fields);
        let discordID = formatUserMentionDiscord(discord_nickname);
        const json = JSON.stringify({
            "username": "Celestia Alert",
            "content": `Mention: ${discordID}`,
            "embeds": [
                {
                    "title": `✅ Validator was recovered!`,
                    "color": NOTIFY_COLOR_MESSAGE,
                    "fields": fields
                }
            ]
        })
        console.log(json)
        await api.post("", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        console.log("Error in notifyRecoveryValidator:", err.message)
    }

}

async function notifyChangeValidator(validator, oldMoniker, changesCount, discord_nickname) {

    try {
        let discordID = formatUserMentionDiscord(discord_nickname);
        console.log("Notify change validator in Discord Bot:", validator)
        const { status, moniker, max_rate, rate, max_change_rate, operator_address, website, identity, security_contact, details } = validator;
        let fields = [];
        if (typeof moniker !== 'undefined') {
            if (oldMoniker !== moniker) {
                fields.push({
                    "name": "Moniker",
                    "value": `Old: ${oldMoniker}\nNew: ${moniker}`
                })
            } /*else {
                fields.push({
                    "name": "Moniker",
                    "value": `${oldMoniker}`
                })
            }*/

        }

        
        if (typeof status !== 'undefined') {
            fields.push({
                "name": "Status",
                "value": `${status.split('BOND_STATUS_')[1]}`
            })
        }
        if (typeof rate !== 'undefined') {
            fields.push({
                "name": "Rate",
                "value": `${rate}`
            })
        }/*
        if (typeof changesCount !== 'undefined') {
            fields.push({
                "name": "WARNNING Changes Count!",
                "value": `${changesCount}`
            })
        }*/
        if (typeof operator_address !== 'undefined') {
            fields.push({
                "name": "Operator Address",
                "value": `${operator_address}`
            })
        }
        if (typeof website !== 'undefined') {
            fields.push({
                "name": "Website",
                "value": `${website}`
            })
        }
        if (typeof identity !== 'undefined') {
            fields.push({
                "name": "Identity",
                "value": `${identity}`
            })
        }
        if (typeof security_contact !== 'undefined') {
            fields.push({
                "name": "Security Contact",
                "value": `${security_contact}`
            })
        }
        if (typeof details !== 'undefined') {
            fields.push({
                "name": "Details",
                "value": `${details}`
            })
        }
        
        
        
        let arrayBody = [];
        let stringPropertiesChanged = "";
        
        console.log(discord_nickname)
        let stringMoniker = "Modification: " + moniker;
        stringPropertiesChanged = stringPropertiesChanged + fields[0].name;
        for (let i = 1; i < fields.length; i++) {
            stringPropertiesChanged = stringPropertiesChanged + ", " + fields[i].name
        }
        /*
        arrayBody.push({
            "name":"Properties that changed in the validator.",
            "value": stringPropertiesChanged
        });
        */
        fields.map(field => {
            arrayBody.push({
                "name": field.name,
                "value": field.value
            })
        });

        const json = JSON.stringify({
            "username": "Celestia Alert",
            "embeds": [
                {
                    "title": stringMoniker,
                    "color": NOTIFY_COLOR_MESSAGE,
                    "fields": arrayBody
                }
            ]
        })
        console.log(JSON.parse(json))
        await api.post("", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        console.log("Error in notifyChangeValidator:", err.message)
        console.error(err)
    }

}

function removeInvalidCharacters(fieldsArray) {

    fieldsArray = fieldsArray.map(field => {
        if (field.value === '' || field.value === 'null') {
            field.value = '-';
            return field
        } else {
            return field
        }
    })

    return fieldsArray;
}

function formatUserMentionDiscord(discord_user_id) {
    if (discord_user_id === null || discord_user_id === '') {
        return "-";
    } else {
        return `<@!${discord_user_id}>`;
    }
}

module.exports = {
    notifyJailedValidator,
    notifyNewValidator,
    notifyChangeValidator,
    notifyLowPerformanceValidator,
    notifyRecoveryValidator
}
