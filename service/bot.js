const config = require("../config.json");
/*
const { Client, Intents, MessageEmbed } = require("discord.js"); //baixar a lib
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
*/


const { Client, GatewayIntentBits, MessageEmbed } = require("discord.js"); //baixar a lib
const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers]
});

const ValidatorService = require('../service/ValidatorService');

const WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE = process.env.WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE;
const WEBSITE_LINK = process.env.WEBSITE_LINK
const BASE_URL_VALIDATOR = process.env.BASE_URL_VALIDATOR
const NOTIFY_COLOR_MESSAGE = process.env.NOTIFY_COLOR_MESSAGE
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_BOT_PREFIX = process.env.DISCORD_BOT_PREFIX

client.login(DISCORD_BOT_TOKEN);

client.on("ready", () => {
    console.log(`Bot foi iniciado com sucesso!`);
    client.user.setPresence({ game: { name: 'comando', type: 1, url: 'https://www.twitch.tv/pedroricardo' } });
    //0 = Jogando
    //  1 = Transmitindo
    //  2 = Ouvindo
    //  3 = Assistindo
});

client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(DISCORD_BOT_PREFIX)) return;

    const args = message.content.slice(DISCORD_BOT_PREFIX.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    // coamdno ping
    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }

    if (comando === "set_nickname") {

        if (args.length > 0) {
            const validatorMoniker = args.join(" ").split(" ")[0];
            console.log("Parameter:", validatorMoniker)

            const validator = await ValidatorService.getValidatorByMoniker(validatorMoniker);
            if (validator !== null) {
                console.log("Validator moniker:", validator.moniker);
                const mentions = message.mentions.users.map(mention => {
                    return mention
                })
                const firstMentionID = mentions[0].id
                console.log("Mention on Discord message:", firstMentionID)
                validator.discord_nickname = firstMentionID;
                validator.save()
                message.channel.send({
                    content: `<@!${firstMentionID}> was added in validator `
                })
            } else {
                message.channel.send({
                    content: `Moniker ${validatorMoniker} not found!`
                })
            }
        } else {
            message.channel.send({
                content: `You need typing validator moniker in $set_nickname command!`
            })
        }
    }

    if (comando === "link") {
        if (args.length > 0) {
            const validatorIdentifier = args.join(" ");
            console.log("Received validator identifier", validatorIdentifier);

            const mentions = message.mentions.users.map(mention => {
                return mention
            })
            let validator=null;
            if (mentions.length > 0) {
                const firstMentionID = mentions[0].id
                validator = await ValidatorService.getValidatorByMonikerOrDiscordNickname(firstMentionID);
            } else {
                validator = await ValidatorService.getValidatorByMonikerOrDiscordNickname(validatorIdentifier);
            }
            if (validator !== null) {
                const { operator_address, moniker } = validator;
                message.channel.send({
                    embeds: [{
                        title: `${moniker} Wallet Link Validator`,
                        color: NOTIFY_COLOR_MESSAGE, description: `${BASE_URL_VALIDATOR}${operator_address}`
                    }]
                }).then(msg => {
                    //setTimeout(() => msg.delete(), 60000)
                })
            } else {
                message.channel.send({
                    content: `${validatorIdentifier} not found!`
                }).then(msg => {
                    //setTimeout(() => msg.delete(), 60000)
                })
            }
        }
    }

    if (comando === "missed") {

        if (args.length > 0) {
            const validatorIdentifier = args.join(" ");
            console.log("Received validator identifier", validatorIdentifier);            

            const mentions = message.mentions.users.map(mention => {
                return mention
            })
            let validator=null;
            if (mentions.length > 0) {
                const firstMentionID = mentions[0].id
                validator = await ValidatorService.getValidatorByMonikerOrDiscordNickname(firstMentionID);
            } else {
                validator = await ValidatorService.getValidatorByMonikerOrDiscordNickname(validatorIdentifier);
            }
            if (validator !== null) {
                const { moniker,
                    missed_blocks } = validator;
                const performance = 100 - ((missed_blocks * 100) / WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE)
                const messageBody = `Performance: ${performance.toFixed(2)}%\nMissed Blocks: ${missed_blocks}`
                const fields = [{
                    name: moniker,
                    value: messageBody
                }]
                console.log(fields)
                const exampleEmbed = {
                    title: moniker,
                    description: messageBody,
                    color: NOTIFY_COLOR_MESSAGE
                }
                try {
                    message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                        //setTimeout(() => msg.delete(), 60000)
                    })
                } catch {
                    console.log("Error in send message Discord Bot")
                }
            } else {
                message.channel.send({ embeds: [{ title: "Validator is not exists!" }] }).then(msg => {
                    //setTimeout(() => msg.delete(), 60000)
                })
            }
        } else {
            try {
                message.channel.send({ embeds: [{ title: "Missing Validator name parameter!" }] }).then(msg => {
                    //setTimeout(() => msg.delete(), 60000)
                })
            } catch {
                console.log("Error in send message Discord Bot")
            }
        }
    }
    if (comando === "status") {
        if (args.length > 0) {
            const validatorIdentifier = args.join(" ");console.log("Received validator identifier", validatorIdentifier);            

            const mentions = message.mentions.users.map(mention => {
                return mention
            })
            let validator=null;
            if (mentions.length > 0) {
                const firstMentionID = mentions[0].id
                validator = await ValidatorService.getValidatorByMonikerOrDiscordNickname(firstMentionID);
            } else {
                validator = await ValidatorService.getValidatorByMonikerOrDiscordNickname(validatorIdentifier);
            }
            if (validator) {
                const { moniker,
                    missed_blocks,
                    rate,
                    max_rate,
                    max_change_rate,
                    operator_address,
                    website,
                    details,
                    security_contact } = validator;
                const performance = 100 - ((missed_blocks * 100) / WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE);

                let exampleEmbed = {
                    title: `${moniker}`,
                    description: "Validator resume info",
                    color: NOTIFY_COLOR_MESSAGE,
                    fields: [{
                        name: "Performance:",
                        value: `${performance.toFixed(2)}`
                    },
                    {
                        name: "Missed Blocks",
                        value: `${missed_blocks}`
                    },
                    {
                        name: "Rate",
                        value: `${rate}`
                    },
                    {
                        name: "Max Rate",
                        value: `${max_rate}`
                    },
                    {
                        name: "Max Rate Change",
                        value: `${max_change_rate}`
                    },
                    {
                        name: "Operator Address",
                        value: `${operator_address}`
                    },
                    {
                        name: "Website",
                        value: `${website}`
                    },
                    {
                        name: "Security Contact",
                        value: `${security_contact}`
                    },
                    {
                        name: "Details",
                        value: `${details}`
                    }]
                }

                exampleEmbed.fields = exampleEmbed.fields.map(field => {
                    if (field.value === '' || field.value === 'null') {
                        field.value = '-';
                        return field
                    } else {
                        return field
                    }
                })

                console.log(exampleEmbed)
                try {
                    message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                        //setTimeout(() => msg.delete(), 60000)
                    })
                } catch {
                    console.log("Error in send message Discord Bot")
                }
            } else {
                message.channel.send({ embeds: [{ title: "Validator is not exists!" }] }).then(msg => {
                    setTimeout(() => msg.delete(), 60000)
                })
            }


        } else {
            const validators = await ValidatorService.getAllNotJailedValidators();

            const fields = validators.map(validator => {
                const { moniker, missed_blocks, rate } = validator;
                const performance = 100 - ((missed_blocks * 100) / WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE)
                const message = `Performance: ${performance.toFixed(2)}%\nMissed Blocks: ${missed_blocks}\nRate: ${rate}`
                return {
                    name: moniker,
                    value: ""
                }
            })

            //if (fields.length > 25) Last logic
            if (fields.length > 0) {
                let notifyMessageFields = [];
                let notifySimpleNotifyMessage = ""

                fields.map(field => {
                    notifySimpleNotifyMessage = notifySimpleNotifyMessage + "• " + field.name + "\n"
                })
                const exampleEmbed = {
                    title: "BONDED VALIDATORS!",
                    description: "This message is deleted after 60 seconds!!!\n\n" + notifySimpleNotifyMessage,
                    color: NOTIFY_COLOR_MESSAGE,
                    fields: []
                }
                message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                    setTimeout(() => msg.delete(), 60000)
                })
                /*
                for (let i = 0; i < fields.length; i++) {
                    
                    notifySimpleNotifyMessage = notifySimpleNotifyMessage + fields[i].name+"\n"
    
                    const exampleEmbed = {
                        title: "BONDED VALIDATORS!",
                        description: "This message is deleted after 60 seconds!!!\n"+notifySimpleNotifyMessage,
                        color: "0x36A832",
                        fields: []
                    }
                    message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                        setTimeout(() => msg.delete(), 60000)
                    })
                    
                    notifyMessageFields.push(fields[i]);
                    if (notifyMessageFields.length === 25) {
                        const exampleEmbed = {
                            title: "BONDED VALIDATORS!",
                            description: "This message is deleted after 60 seconds!!!\n"+notifySimpleNotifyMessage,
                            color: "0x36A832",
                            fields: []
                        }
                        message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                            setTimeout(() => msg.delete(), 60000)
                        })
                        notifyMessageFields = []
                    }
                    if (i == fields.length - 1) {
                        const exampleEmbed = {
                            title: "BONDED VALIDATORS!",
                            description: "This message is deleted after 60 seconds!!!\n"+notifySimpleNotifyMessage,
                            color: "0x36A832",
                            fields:  []
                        }
                        if (notifyMessageFields.length > 0) {
                            message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                                setTimeout(() => msg.delete(), 60000)
                            })
                        }
    
                        notifyMessageFields = []
                    }
                    
                }*/
            }
            /*
            const exampleEmbed = {
                title: "Validators not jailed!",
                description: "Validators not jailed in Celestia Network",
                color: "0x36A832",
                fields: fields
            }
            message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                setTimeout(() => msg.delete(), 60000)
            })*/
        }
    }

    if (comando === "help") {
        const exampleEmbed = {
            title: `Help Commands`,
            description: "Type this comands for get Validators info",
            color: NOTIFY_COLOR_MESSAGE,
            fields: [
                {
                    name: "!!! INFO !!!",
                    value: "This bot sends notifications when the validator changes, or when a new validator is created. It also warns about lost blocks and when the validator gets stuck."
                },
                {
                    name: "$status",
                    value: "This commands returns summary all validators info"
                },
                {
                    name: "$status <Validator Moniker>",
                    value: "This commands returns complete validator info"
                },
                {
                    name: "$missed <Validator Moniker>",
                    value: "This command returns validator performance information"
                },
                {
                    name: "$set_nickname <Validator Moniker> @discord-user-mention",
                    value: "Add your discord user for mentions in alerts"
                },
                {
                    name: "$link",
                    value: "This command returns the explorer link"
                },
                {
                    name: "$link <Validator Moniker>",
                    value: "This command returns the validator explorer link"
                }]
        }
        console.log(exampleEmbed)
        try {
            message.channel.send({ embeds: [exampleEmbed] }).then(msg => {
                setTimeout(() => msg.delete(), 60000)
            })
        } catch {
            console.log("Error in send message Discord Bot")
        }
    }
});
