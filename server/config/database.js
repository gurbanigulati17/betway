const { createPool } = require('mysql');
let util = require('util');
const keys = require('../keys')

const pool = createPool({
    port:keys.DB_PORT,
    host: keys.HOST,
    user: keys.DB_USERNAME,
    password: keys.DB_PASSWORD,
    database: keys.DB_NAME,
    connectionLimit: 100
});

// Attempt to catch disconnects 
pool.on('connection', function (connection) {
   // console.log('DB Connection established');
  
    connection.on('error', function (err) {
      console.error(new Date(), 'MySQL error', err.code);
      connection.release();
    });
    connection.on('close', function (err) {
      console.error(new Date(), 'MySQL close', err);
    });
  
  });

pool.query = util.promisify(pool.query);

module.exports = pool;