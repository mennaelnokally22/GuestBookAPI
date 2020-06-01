require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
require('./db');

app.listen(process.env.PORT_NUM);
