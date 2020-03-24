const express = require('express');
require('./db/mongoose');
const maintenanceMiddleware = require('./middleware/maintenance');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(maintenanceMiddleware);
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;