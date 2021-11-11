const express = require('express');
const superadminRouter = require('../router/superadminRouter');
const userRouter = require('../router/userRouter');
const cors = require('cors');
const app = express();
const keys = require('../keys')

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

if (keys.NODE_ENV === 'production') {
    corsOptions = {
        origin: ['https://FairExch1.com', 'https://www.FairExch1.com'],
        optionsSuccessStatus: 200
    }
}

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/superadmin', superadminRouter);
app.use('/user', userRouter);

const ApiConfig = {
    app: app
}

module.exports = ApiConfig;
