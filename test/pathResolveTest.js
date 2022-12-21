
const fs = require('fs');
const path = require('path');

async function test(){
    fs.readFile('./collectedData/valida.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        let validators = JSON.parse(data).validators;
        validators.map(validator=>{
            console.log(validator.description.moniker)
        })
      
      });
}

setInterval(()=>{
    test()
}, 3 * 1000)
