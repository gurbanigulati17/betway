const Promise = require('bluebird');
const mysql = require('mysql');
const keys = require('../keys')

const databaseConfigs={
    port:keys.DB_PORT,
    host: keys.HOST,
    user: keys.DB_USERNAME,
    password: keys.DB_PASSWORD,
    database: keys.DB_NAME
};

transaction = async (queries, queryValues, callback) => {
    if (queries.length !== queryValues.length) {
        return Promise.reject(
            'Number of provided queries did not match the number of provided query values arrays'
        )
    }
    const connection = mysql.createConnection(databaseConfigs);
    Promise.promisifyAll(connection);
    return connection.connectAsync()
        .then(connection.beginTransactionAsync())
        .then(() => {
            const queryPromises = [];

            queries.forEach((query, index) => {
                queryPromises.push(connection.queryAsync(query, queryValues[index]));
            });
            return Promise.all(queryPromises);
        })
        .then(results => {
            return connection.commitAsync()
                .then(connection.endAsync())
                .then(() => {
                    return callback(null, results);
                });
        })
        .catch(err => {
            return connection.rollbackAsync()
                .then(connection.endAsync())
                .then(() => {
                    return callback(Promise.reject(err));
                });
        });
}

module.exports={
    transaction
}