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
    let isMencioned = true;
    let title_message="Validator performance is low.";
    if (recovering_status!=='undefined'){
        signal_recovering = recovering_status;
        if(recovering_status==='>'){
            title_message = "Validator is recovering."
            signal_recovering= "\u003E"
            isMencioned = false;
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
            "content": isMencioned ? true : `Mention: ${discordID}`,
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
                "value": `${rate/10000000000000000}%`
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

// PROPOSALS
/*
-> [✅] NotifyNewProposal(proposal): Notificar quando a proposta for nova;
-> [✅] NotifyAceptedProposal(proposal): Notificar quando a proposta for aceita;
-> [✅] NotifyRejectedProposal(proposal): Notificar quando a proposta for recusada;
-> [✅] NotifyAbortedProposal(proposal): Notificar quando a proposta for abortada;
-> [ ] notifyWithdrawalProposal(proposal): Notificar quando a proposta for retirada;
*/


async function notifyNewProposal(proposal){
    console.log(`Notify new Proposal in Discord Bot: ${proposal.title}`);
    const { id, title, description, status } = proposal;
    let fields = [];

    if(typeof id !== 'undefined'){
        fields.push({
            "name": "Number",
            "value": `${id}`
        });
    };

    if(typeof title !== 'undefined'){
        fields.push({
            "name": "Title",
            "value": `${title}`
        });
    };

    if(typeof description !== 'undefined'){
        fields.push({
            "name": "Description",
            "value": `${description}`
        });
    };

    if(typeof status !== 'undefined'){
        fields.push({
            "name": "Status",
            "value": `${status}`
        });
    };


    fields = removeInvalidCharacters(fields);

    const json = JSON.stringify({
        "username": "Celestia Alert",
        "embeds": [
            {
                "title": "New Proposal!",
                "description": "A new proposal was identified in Celestia Network",
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": fields,
                "thumbnail": {
                    "url": "https://t3.ftcdn.net/jpg/00/90/20/08/240_F_90200846_rAoY6CMRSJ7X8gFJyzyXKYtvxQqK28Lk.jpg"
                }
            }
        ]
    })


    await api.post("", json, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(err => {
        console.log(err);
    })

}

async function notifyAceptedProposal(proposal){
    const title = proposal.title;
    const descriptionString = "```" + proposal.description + "```";
    const json = JSON.stringify({
        
        "username": "Celestia Alert",
        "embeds": [
            {
                "title": `🟢 Proposal Nº ${proposal.id} Accepted!`,
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": [
                    {
                        "name": "Proposal Title",
                        "value": `**${title.toUpperCase()}**`,

                        "name": "Description",
                        "value": `${descriptionString}`
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

async function notifyRejectedProposal(proposal){
    const title = proposal.title;
    const descriptionString = "```" + proposal.description + "```";
    const json = JSON.stringify({
        
        "username": "Celestia Alert",
        "embeds": [
            {
                "title": `🔴 Proposal Nº ${proposal.id} Rejected!`,
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": [
                    {
                        "name": "Proposal Title",
                        "value": `**${title.toUpperCase()}**`,

                        "name": "Description",
                        "value": `${descriptionString}`
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

async function notifyAbortedProposal(proposal){
    const title = proposal.title;
    const descriptionString = "```" + proposal.description + "```";
    const json = JSON.stringify({
        
        "username": "Celestia Alert",
        "embeds": [
            {
                "title": `❌ Proposal Nº ${proposal.id} Aborted!`,
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": [
                    {
                        "name": "Proposal Title",
                        "value": `**${title.toUpperCase()}**`,

                        "name": "Description",
                        "value": `${descriptionString}`
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

async function notifyWithdrawalProposal(proposal){
    const title = proposal.title;
    const descriptionString = "```" + proposal.description + "```";
    const json = JSON.stringify({
        
        "username": "Celestia Alert",
        "embeds": [
            {
                "title": `❕ Proposal Nº ${proposal.id} Withdrawn!`,
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": [
                    {
                        "name": "Proposal Title",
                        "value": `**${title.toUpperCase()}**`,

                        "name": "Description",
                        "value": `${descriptionString}`
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

module.exports = {
    notifyJailedValidator,
    notifyNewValidator,
    notifyChangeValidator,
    notifyLowPerformanceValidator,
    notifyRecoveryValidator,
    notifyNewProposal,
    notifyAceptedProposal,
    notifyRejectedProposal,
    notifyAbortedProposal,
    notifyWithdrawalProposal
}
