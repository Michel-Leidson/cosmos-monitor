# Bot

## Install

1 - Before you begin, you might want to make sure your system is up to date.
###
```
sudo apt update && sudo apt upgrade -y && sudo apt install -y build-essential
``` 
2- Download Repository
###
```
 git clone https://github.com/Michel-Leidson/cosmos-monitor.git
```
3- Enter in directory
###
```
cd cosmos-monitor
```
4- Create config
###
```
nano .env
``` 
``` 
DISCORD_BOT_PREFIX=$
DISCORD_BOT_TOKEN=<your discord bot token>
DISCORD_URL_WEBHOOK=<your discord url webhook>
WINDOW_BLOCKS_SIZE_FOR_CALCULATE_PERFORMANCE=<Signed Block Window example:> #5000
NOTIFY_COLOR_MESSAGE=<color in decimal>
HEXADECIMAL_COLOR=<color in hexadecimal example:> #E3E3E3
BASE_URL_VALIDATOR=<example:> #https://explorer.stakepool.dev.br/network/staking/
WEBSITE_LINK=<example:> #https://explorer.stakepool.dev.br/network
REST_NETWORK_URL=<example:> #https://rest.explorer.network.stakepool.dev.br
BOT_NAME=<name example:> #Bot-test
``` 
5- Create a script with the following syntax:
###
```
nano consensus.sh
#!/bin/bash
python3 ./scripts/getConsensusData.py
```
6- Add permissions to the script.
###
```
chmod +x consensus.sh
```

7- Create a file.
###
```
mkdir collectedData
```

8- Schedule tasks to be performed by the system periodically.
###
```
* * * * * cd /home/<path>/cosmos-monitor && ./consensus.sh
* * * * * /go/bin/grpcurl -plaintext -d '{"pagination":{"limit":"100"} }'  <IP_node>:<port_grpc> cosmos.gov.v1beta1.Query/Proposals | jq >  /home/<path>/cosmos-monitor/collectedData/proposals.json
* * * * * /go/bin/grpcurl -plaintext -d '{"pagination":{"limit":"100"} }'  <IP_node>:<port_grpc> cosmos.staking.v1beta1.Query/Validators | jq > /home/<path>/cosmos-monitor/collectedData/valida.json
* * * * * /go/bin/grpcurl -plaintext -d '{"pagination":{"limit":"100"} }'  <Ip_node>:<port_grpc> cosmos.slashing.v1beta1.Query/SigningInfos | jq > /home/<path>/cosmos-monitor/collectedData/block_missed.json
```

9- Starting application
###
```
npm install
pm2 start service/monitor.js --name <your-name-monitor>
pm2 start service/bot.js --name <your-name-bot>
pm2 startup
pm2 save
```


