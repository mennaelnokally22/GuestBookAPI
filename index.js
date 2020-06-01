require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
require('./db');
const {
  globalErrorHandler,
  validationErrorHandler,
} = require('./helpers/errorHandlers');

const userRouter = require('./routes/User');
const messageRouter = require('./routes/Message');

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/message', messageRouter);

app.use(validationErrorHandler);
app.use(globalErrorHandler);

app.listen(process.env.PORT_NUM);
