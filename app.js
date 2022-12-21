const cors = require('cors');
const bodyParser = require('body-parser');
var express = require('express');
const { getInstant } = require('./until');
require('dotenv').config();
const alertBot = require('./service/alert-bot');

var app = express();
process.setMaxListeners(0);
app.use(bodyParser());
app.use(cors());

app.listen(4000, function () {
    console.log(getInstant() + ' [ MATIC Web REST API ] Is Running in Port 4000');
});