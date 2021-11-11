const axios = require('axios')

const instance = axios.create({ baseURL: 'http://65.0.166.92:3200/api' });

module.exports = instance
