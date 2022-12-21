const testBody = {
    moniker:"Moniker Test"
}

let outputObject = {
    ...testBody,
    identity: "Teste"
}

outputObject = {
    ...outputObject,
    security: "Teste"
}

console.log(outputObject)