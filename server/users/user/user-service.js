const { transaction } = require('../../transaction_handler/transaction');
const pool = require('../../config/database');
const axios = require('../../axios-instance/oddsApi');
const client = require('../../config/redisCon');
const { fancybook, fancyBetValidation, applyCommission, eventAndClientInfo, calculateBetValidation,
    calculateNewBetValidation } = require('../../config/helpers');

module.exports = {
    doesUserExists: (username, callback) => {

        if (username.toLowerCase() === 'admin') {
            query = 'select username from admin where username=?'
        } else {
            query = 'select username from users where username=?'
        }

        pool.query(query, [username], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    create: (data, callback) => {

        if (data.downlink.toLowerCase() === 'admin') {
            callback(null, 'admin is a reserverd word!')
            return
        }

        const queries = [], queryValues = [];
        if (data.my_username.toLowerCase() === 'admin') {

            if (data.usertype === 2) {
                const query = `insert into users(username,password,fullname,usertype,commission) values(?,?,?,?,?)`;
                const queryValue = [data.downlink, data.password, data.fullname, data.usertype.toString(), '0'];
                queries.push(query);
                queryValues.push(queryValue);
                let sports = ['1', '2', '4', '5']
                for (let sport of sports) {

                    const query2 = 'insert into limitmap(username,event_type) values(?,?)'
                    const query3 = 'SET @id = LAST_INSERT_ID()';
                    const query4 = 'insert into limitsports(id) values(@id)'

                    queries.push(query2, query3, query4);

                    const queryValue2 = [data.downlink, sport];
                    const queryValue3 = [];
                    const queryValue4 = [];
                    queryValues.push(queryValue2, queryValue3, queryValue4);
                }
            } else {

                const query1 = `insert into users(username,password,fullname,usertype,commission) values(?,?,?,?,?)`;
                const query2 = 'insert into isclient(downlink,uplink) values(?,?)';
                queries.push(query1, query2);

                const queryValue1 = [data.downlink, data.password, data.fullname, data.usertype.toString(), data.usertype.toString() === '5' ? '0.02' : '0'];
                const queryValue2 = [data.downlink, data.uplink];
                queryValues.push(queryValue1, queryValue2);

                if (data.usertype === 5) {
                    const query3 = 'insert into stakevalue(username) values(?)';
                    const query4 = 'insert into stakelabel(username) values(?)';
                    queries.push(query3, query4);

                    const queryValue3 = [data.downlink];
                    const queryValue4 = [data.downlink];
                    queryValues.push(queryValue3, queryValue4);

                    let sports = ['1', '2', '4', '5']
                    for (let sport of sports) {

                        const query5 = 'insert into limitmap(username,event_type) values(?,?)'
                        const query6 = 'SET @id = LAST_INSERT_ID()';
                        let query7
                        if (sport === '5') {
                            query7 = 'insert into limitfancyrisk(id) values(@id)'
                        } else {

                            if (sport === '1' || sport === '2') {
                                query7 = 'insert into limitrisk(id,timer) values(@id,?)'
                            }
                            else {
                                query7 = 'insert into limitrisk(id,max_stake) values(@id,?)'
                            }
                        }
                        queries.push(query5, query6, query7);

                        const queryValue5 = [data.downlink, sport];
                        const queryValue6 = [];
                        let queryValue7
                        if (sport === '1' || sport === '2') {
                            queryValue7 = ['6']
                        } else {
                            queryValue7 = ['500000'];
                        }
                        queryValues.push(queryValue5, queryValue6, queryValue7);
                    }
                } else {

                    let sports = ['1', '2', '4', '5']
                    for (let sport of sports) {

                        const query3 = 'insert into limitmap(username,event_type) values(?,?)'
                        const query4 = 'SET @id = LAST_INSERT_ID()';
                        const query5 = 'insert into limitsports(id) values(@id)'

                        queries.push(query3, query4, query5);

                        const queryValue3 = [data.downlink, sport];
                        const queryValue4 = [];
                        const queryValue5 = [];
                        queryValues.push(queryValue3, queryValue4, queryValue5);
                    }
                }
            }

        } else {
            const query1 = 'select suspended,bet_suspended from users where username=?'
            pool.query(query1, [data.uplink], (err, result, fields) => {
                if (err)
                    callback(err);
                else {
                    if (result[0].suspended) {
                        callback(null, 'Your account has been suspended! Contact upline')
                    }
                    else {

                        let query1
                        if (!result[0].bet_suspended) {
                            query1 = 'insert into users (username,password,fullname,usertype,commission) values(?,?,?,?,?)';
                        }
                        else {
                            query1 = 'insert into users (username,password,fullname,usertype,commission,bet_suspended) values(?,?,?,?,?,?)';
                        }
                        const query2 = 'insert into isclient(downlink,uplink) values(?,?)';
                        queries.push(query1, query2);

                        const queryValue1 = [data.downlink, data.password, data.fullname, data.usertype.toString(), data.usertype.toString() === '5' ? '0.02' : '0', 1];
                        const queryValue2 = [data.downlink, data.uplink];
                        queryValues.push(queryValue1, queryValue2);

                        if (data.usertype === 5) {
                            const query3 = 'insert into stakevalue(username) values(?)';
                            const query4 = 'insert into stakelabel(username) values(?)';
                            queries.push(query3, query4);

                            const queryValue3 = [data.downlink];
                            const queryValue4 = [data.downlink];
                            queryValues.push(queryValue3, queryValue4);

                            let sports = ['1', '2', '4', '5']
                            for (let sport of sports) {

                                const query5 = 'insert into limitmap(username,event_type) values(?,?)'
                                const query6 = 'SET @id = LAST_INSERT_ID()';
                                let query7
                                if (sport === '5') {
                                    query7 = 'insert into limitfancyrisk(id) values(@id)'
                                } else {
                                    if (sport === '1' || sport === '2') {
                                        query7 = 'insert into limitrisk(id,timer) values(@id,?)'
                                    } else {
                                        query7 = 'insert into limitrisk(id,max_stake) values(@id,?)'
                                    }
                                }
                                queries.push(query5, query6, query7);

                                const queryValue5 = [data.downlink, sport];
                                const queryValue6 = [];
                                let queryValue7
                                if (sport === '1' || sport === '2') {
                                    queryValue7 = ['6']
                                } else {
                                    queryValue7 = ['500000'];
                                }
                                queryValues.push(queryValue5, queryValue6, queryValue7);
                            }
                        } else {
                            let sports = ['1', '2', '4', '5']
                            for (let sport of sports) {

                                const query3 = 'insert into limitmap(username,event_type) values(?,?)'
                                const query4 = 'SET @id = LAST_INSERT_ID()';
                                const query5 = 'insert into limitsports(id) values(@id)'

                                queries.push(query3, query4, query5);

                                const queryValue3 = [data.downlink, sport];
                                const queryValue4 = [];
                                const queryValue5 = [];
                                queryValues.push(queryValue3, queryValue4, queryValue5);
                            }
                        }
                    }
                }
            })
        }


        transaction(queries, queryValues, (err, result) => {

            if (err)
                callback(err);
            else
                callback(null, 'User created successfully');
        });
    },
    deposit: (data, callback) => {

        const key = {
            uplink: data.uplink,
            downlink: data.downlink,
            uplink_type: data.uplink_type,
            downlink_type: data.downlink_type,
            money: data.money
        }

        client.get(JSON.stringify(key), (err, result) => {

            if (err) {
                return callback(err)
            }

            if (result) {
                callback(null, 'Transaction processing...', false)
            } else {
                client.set(JSON.stringify(key), '1', async (err) => {
                    if (err)
                        return callback(err)

                    if (data.downlink_type === '2') {
                        const queries = [], queryValues = [];

                        const query1 = "update users set balance=balance+?,credit_limit=credit_limit+? where username=? and usertype=?";
                        const query2 = "update admin set coins_generated=coins_generated+? where username=?";
                        const query3 = "select @coins_generated:=coins_generated from admin where username=?"
                        const query4 = 'insert into adsetransactions(deposited,description,balance,created_at) values(?,?,@coins_generated,?)'
                        const query5 = "select @balance:=balance from users where username=?"
                        const query6 = 'insert into transactionmap(username) values(?)';
                        const query7 = 'SET @trans_id = LAST_INSERT_ID()';
                        const query8 = 'insert into alltransactions(transaction_id,deposited,description,balance,created_at) values(@trans_id,?,?,@balance,?)'

                        queries.push(query1, query2, query3, query4, query5, query6, query7, query8);

                        const queryValue1 = [data.money, data.money, data.downlink, data.downlink_type];
                        const queryValue2 = [data.money, data.uplink];
                        const queryValue3 = [data.uplink]
                        const queryValue4 = [data.money, data.uplink + ' deposited in ' + data.downlink, new Date()];
                        const queryValue5 = [data.downlink]
                        const queryValue6 = [data.downlink]
                        const queryValue7 = []
                        const queryValue8 = [data.money, data.downlink + ' received from ' + data.uplink, new Date()];

                        queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8);

                        transaction(queries, queryValues, (err, result) => {

                            if (err)
                                callback(err);
                            else
                                callback(null, 'Successfully deposited');
                        });
                    } else {

                        const query1 = 'select suspended from users where username=?'
                        pool.query(query1, [data.username], (err, result, fields) => {
                            if (err)
                                callback(err);
                            else {
                                if (result.length && result[0].suspended) {
                                    callback(null, 'Your account has been suspended! Contact upline')
                                }
                                else {
                                    const queries = [], queryValues = [];

                                    const query1 = 'update users set balance=balance-?,exposure=exposure+? where username=? and usertype=?';
                                    const query2 = 'update users set balance=balance+?,credit_limit=credit_limit+? where username=? and usertype=?';
                                    let query3
                                    if (data.downlink_type === '5') {
                                        query3 = "select @down_balance:=balance+exposure from users where username=?"
                                    } else {
                                        query3 = "select @down_balance:=balance from users where username=?"
                                    }
                                    const query4 = "select @up_balance:=balance from users where username=?"
                                    const query5 = 'insert into transactionmap(username) values(?)';
                                    const query6 = 'SET @trans_id = LAST_INSERT_ID()';
                                    const query7 = 'insert into alltransactions(transaction_id,deposited,description,balance,created_at) values(@trans_id,?,?,@down_balance,?)';
                                    const query8 = 'insert into transactionmap(username) values(?)';
                                    const query9 = 'SET @trans_id = LAST_INSERT_ID()';
                                    const query10 = 'insert into alltransactions(transaction_id,withdrawn,description,balance,created_at) values(@trans_id,?,?,@up_balance,?)';

                                    queries.push(query1, query2, query3, query4, query5, query6, query7, query8, query9, query10);

                                    const queryValue1 = [data.money, data.money, data.uplink, data.uplink_type];
                                    const queryValue2 = [data.money, data.money, data.downlink, data.downlink_type, data.money];
                                    const queryValue3 = [data.downlink]
                                    const queryValue4 = [data.uplink];
                                    const queryValue5 = [data.downlink];
                                    const queryValue6 = [];
                                    const queryValue7 = [data.money, data.downlink + ' received from ' + data.uplink, new Date()];
                                    const queryValue8 = [data.uplink];
                                    const queryValue9 = [];
                                    const queryValue10 = [data.money, data.uplink + ' deposited in ' + data.downlink, new Date()];

                                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10);

                                    transaction(queries, queryValues, (err, result) => {

                                        if (err)
                                            callback(err);
                                        else
                                            callback(null, 'Successfully deposited');
                                    });
                                }
                            }
                        })
                    }
                })
            }
        })
    },
    withdraw: (data, callback) => {

        const key = {
            uplink: data.uplink,
            downlink: data.downlink,
            uplink_type: data.uplink_type,
            downlink_type: data.downlink_type,
            money: data.money
        }
        client.get(JSON.stringify(key), (err, result) => {

            if (err) {
                return callback(err)
            }

            if (result) {
                callback(null, 'Transaction processing...', false)
            } else {
                client.set(JSON.stringify(key), '1', async (err) => {
                    if (err)
                        return callback(err)
                    if (data.downlink_type === '2') {

                        const queries = [], queryValues = [];

                        const query1 = "update users set balance=balance-?,credit_limit=credit_limit-? where username=? and usertype=?";
                        const query2 = "update admin set coins_withdrawn=coins_withdrawn+? where username=?";
                        const query3 = "select @coins_withdrawn:=coins_withdrawn from admin where username=?"
                        const query4 = 'insert into adsetransactions(withdrawn,description,balance,created_at) values(?,?,@coins_withdrawn,?)'
                        const query5 = "select @balance:=balance from users where username=?"
                        const query6 = 'insert into transactionmap(username) values(?)';
                        const query7 = 'SET @trans_id = LAST_INSERT_ID()';
                        const query8 = 'insert into alltransactions(transaction_id,withdrawn,description,balance,created_at) values(@trans_id,?,?,@balance,?)'

                        queries.push(query1, query2, query3, query4, query5, query6, query7, query8);

                        const queryValue1 = [data.money, data.money, data.downlink, data.downlink_type];
                        const queryValue2 = [data.money, data.uplink];
                        const queryValue3 = [data.uplink]
                        const queryValue4 = [data.money, data.uplink + ' withdrew from ' + data.downlink, new Date()];
                        const queryValue5 = [data.downlink]
                        const queryValue6 = [data.downlink]
                        const queryValue7 = []
                        const queryValue8 = [data.money, data.uplink + ' withdrew from ' + data.downlink, new Date()];

                        queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8);

                        transaction(queries, queryValues, (err, result) => {

                            if (err)
                                callback(err);
                            else
                                callback(null, 'Successfully withdrawn');
                        });
                    } else {
                        const query1 = 'select suspended from users where username=?'
                        pool.query(query1, [data.uplink], (err, result, fields) => {
                            if (err)
                                callback(err);
                            else {
                                if (result[0].suspended) {
                                    callback(null, 'Your account has been suspended! Contact upline')
                                }
                                else {
                                    const queries = [], queryValues = [];

                                    const query1 = 'update users set balance=balance-?,credit_limit=credit_limit-? where username=? and usertype=?';
                                    const query2 = 'update users set balance=balance+?,exposure=exposure-? where username=? and usertype=?';
                                    let query3
                                    if (data.downlink_type === '5') {
                                        query3 = "select @down_balance:=balance+exposure from users where username=?"
                                    } else {
                                        query3 = "select @down_balance:=balance from users where username=?"
                                    }
                                    const query4 = "select @up_balance:=balance from users where username=?"
                                    const query5 = 'insert into transactionmap(username) values(?)';
                                    const query6 = 'SET @trans_id = LAST_INSERT_ID()';
                                    const query7 = 'insert into alltransactions(transaction_id,withdrawn,description,balance,created_at) values(@trans_id,?,?,@down_balance,?)';
                                    const query8 = 'insert into transactionmap(username) values(?)';
                                    const query9 = 'SET @trans_id = LAST_INSERT_ID()';
                                    const query10 = 'insert into alltransactions(transaction_id,deposited,description,balance,created_at) values(@trans_id,?,?,@up_balance,?)';

                                    queries.push(query1, query2, query3, query4, query5, query6, query7, query8, query9, query10);

                                    const queryValue1 = [data.money, data.money, data.downlink, data.downlink_type];
                                    const queryValue2 = [data.money, data.money, data.uplink, data.uplink_type];
                                    const queryValue3 = [data.downlink]
                                    const queryValue4 = [data.uplink];
                                    const queryValue5 = [data.downlink];
                                    const queryValue6 = [];
                                    const queryValue7 = [data.money, data.uplink + ' withdrew from ' + data.downlink, new Date()];
                                    const queryValue8 = [data.uplink];
                                    const queryValue9 = [];
                                    const queryValue10 = [data.money, data.uplink + ' withdrew from ' + data.downlink, new Date()];

                                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10);

                                    transaction(queries, queryValues, (err, result) => {

                                        if (err)
                                            callback(err);
                                        else
                                            callback(null, 'Successfully withdrawn');
                                    });
                                }
                            }
                        })
                    }
                })
            }
        })
    },
    findUserByUsername: (username, callback) => {

        let query
        if (username.toLowerCase() === 'admin') {
            query = 'select username,password from admin where username=?';
        } else {
            query = 'select username,password,usertype,suspended from users where username=?';
        }
        pool.query(query, [username], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                if (result.length && !result[0].usertype) {
                    result[0].usertype = '1'
                }
                callback(null, result);
            }
        });
    },
    // credit: (data, callback) => {

    //     const query = 'update masters set credit_ref=? where username=?'
    //     pool.query(query, [data.credit_ref, data.username], (err, result, fields) => {

    //         if (err) {
    //             callback(err)
    //         }
    //         else {
    //             callback(null, result)
    //         }
    //     })
    // },
    myInfo: (data, callback) => {

        if (data.username.toLowerCase() === 'admin') {

            const query = 'select username,coins_generated,coins_withdrawn from admin where username=?';
            pool.query(query, [data.username], (err, result, fields) => {
                if (err)
                    return callback(err);

                if (result.length) {
                    result[0].usertype = '1'
                    result[0].loginTime = data.time
                    result[0].expiresIn = data.expiresIn
                }

                result.push({
                    username: data.username + ' deleted'
                })

                return callback(null, result);
            });
        } else {

            const query = 'select username,credit_limit,balance,exposure,usertype,bet_suspended from users where username=?';
            pool.query(query, [data.username], (err, result, fields) => {
                if (err)
                    return callback(err);

                if (result.length) {
                    result[0].loginTime = data.time
                    result[0].expiresIn = data.expiresIn
                }

                result.push({
                    username: data.username + ' deleted'
                })

                callback(null, result);
            });
        }
    },
    authCheck: (data, callback) => {

        const key = {
            type: 'info',
            username: data.username
        }

        client.get(JSON.stringify(key), (err, info) => {

            if (err)
                return callback(err)

            const expirationDate = new Date(new Date(data.time).getTime() + data.expiresIn * 1000)

            if (info) {
                const myInfo = JSON.parse(info)
                myInfo[0].loginTime = data.time
                myInfo[0].expiresIn = data.expiresIn
                myInfo[0].isExpired = expirationDate <= new Date()
                myInfo[0].timer = expirationDate.getTime() - new Date().getTime()
                return callback(null, myInfo)
            }

            if (data.username.toLowerCase() === 'admin') {

                const result = [], obj = {}
                obj.username = 'admin'
                obj.usertype = '1'
                result.push(obj)
                client.set(JSON.stringify(key), JSON.stringify(result), 'EX', 2 * 60 * 60, (err, reply) => {

                    if (err)
                        return callback(err);

                    result[0].loginTime = data.time
                    result[0].expiresIn = data.expiresIn
                    result[0].isExpired = expirationDate > new Date()
                    result[0].timer = expirationDate.getTime() - new Date().getTime()
                    callback(null, result)
                })
            } else {

                const query = 'select username,usertype from users where username=?';
                pool.query(query, [data.username], (err, result, fields) => {
                    if (err)
                        return callback(err);

                    client.set(JSON.stringify(key), JSON.stringify(result), 'EX', 2 * 60 * 60, (err, reply) => {

                        if (err)
                            return callback(err);

                        result[0].loginTime = data.time
                        result[0].expiresIn = data.expiresIn
                        result[0].isExpired = expirationDate > new Date()
                        result[0].timer = expirationDate.getTime() - new Date().getTime()
                        callback(null, result);
                    })

                });
            }
        })

    },
    userBalanceInfo: (username, callback) => {

        if (username.toLowerCase() === 'admin') {

            const query = 'select username,coins_generated,coins_withdrawn from admin where username=?';
            pool.query(query, [username], (err, result, fields) => {
                if (err)
                    callback(err);
                else {
                    result[0].usertype = '1'
                    callback(null, result);
                }
            });

        } else {
            const query = 'select username,usertype,balance from users where username=?';

            pool.query(query, [username], (err, result, fields) => {
                if (err)
                    callback(err);
                else
                    callback(null, result);
            });
        }
    },
    userAccountStatement: async (data, callback) => {

        if (data.usertype === '1') {

            if (data.type === 'All') {
                const query = 'select * ' +
                    'from adsetransactions ' +
                    'where created_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") ' +
                    'order by created_at desc';

                pool.query(query, [data.from, data.to], (err, result, fields) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, result);
                    }
                });
            } else {
                const query = 'select * ' +
                    'from adsetransactions ' +
                    'where created_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and type=? ' +
                    'order by created_at desc';

                pool.query(query, [data.from, data.to, data.type], (err, result, fields) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, result);
                    }
                });
            }
        } else {

            if (data.type === 'All') {
                const query = 'select *from alltransactions ' +
                    'where created_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and transaction_id IN ' +
                    '(select transaction_id from transactionmap where username=?) ' +
                    'order by created_at desc'

                pool.query(query, [data.from, data.to, data.username, data.username], (err, result, fields) => {
                    if (err)
                        callback(err);
                    else {
                        callback(null, result);
                    }
                });
            } else {
                const query = 'select *from alltransactions ' +
                    'where created_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and type=? and transaction_id IN ' +
                    '(select transaction_id from transactionmap where username=?) ' +
                    'order by created_at desc'

                pool.query(query, [data.from, data.to, data.type, data.username, data.username], (err, result, fields) => {
                    if (err)
                        callback(err);
                    else {
                        callback(null, result);
                    }
                });
            }
        }
    },
    getUsers: async (data, callback) => {

        let query

        if (data.username.toLowerCase() === 'admin') {

            if (data.username.toLowerCase() === 'admin') {
                if (data.usertype === '2') {
                    query = 'select username,fullname,usertype,credit_limit,balance,exposure,winnings,commission,suspended,bet_suspended from users where usertype=?';
                } else {
                    query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B where A.username=B.downlink and A.usertype=?';
                }
            }

        } else {

            try {
                const query1 = 'select usertype from users where username=?';
                const result = await pool.query(query1, [data.username])
                if (result[0].usertype === '2') {

                    if (data.usertype === '3') {
                        query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B where A.username=B.downlink and B.uplink=? and A.usertype=?';
                    } else if (data.usertype === '4') {
                        query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B,isclient as C where A.username=B.downlink and B.uplink=C.downlink and C.uplink=? and A.usertype=?';
                    } else if (data.usertype === '5') {
                        query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B,isclient as C,isclient as D where A.username=B.downlink and B.uplink=C.downlink and C.uplink=D.downlink and D.uplink=? and A.usertype=?';
                    }

                } else if (result[0].usertype === '3') {

                    if (data.usertype === '4') {
                        query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B where A.username=B.downlink and B.uplink=? and A.usertype=?';
                    } else if (data.usertype === '5') {
                        query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B,isclient as C where A.username=B.downlink and B.uplink=C.downlink and C.uplink=? and A.usertype=?';
                    }

                } else if (result[0].usertype === '4') {
                    query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B where A.username=B.downlink and B.uplink=? and A.usertype=?';
                }


            } catch (err) {
                callback(err)
            }
        }

        pool.query(query, data.username.toLowerCase() === 'admin' ? [data.usertype] : [data.username, data.usertype], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                callback(null, result);
            }
        });
    },
    getDownlink: (data, callback) => {

        if (data.my_username.toLowerCase() === 'admin') {
            let query = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,A.commission,A.exposure,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B where A.username=B.downlink and B.uplink=?';

            pool.query(query, [data.username], (err, result, fields) => {
                if (err)
                    callback(err);
                else {
                    callback(null, result);
                }
            });
        } else {
            const query1 = 'select usertype,username from users where username=? or username=?'
            pool.query(query1, [data.username, data.my_username], (err, result, fields) => {
                if (err)
                    callback(err);
                else {

                    if (result.length !== 2) {
                        callback(null, false)
                        return
                    }

                    let query2

                    const parent_usertype = parseFloat(result.filter(user => user.username.toLowerCase() === data.my_username.toLowerCase())[0].usertype)
                    const child_usertype = parseFloat(result.filter(user => user.username.toLowerCase() === data.username.toLowerCase())[0].usertype)

                    if (parent_usertype >= child_usertype) {
                        callback(null, false)
                        return
                    } else {
                        switch (child_usertype - parent_usertype) {
                            case 3:
                                query2 = 'select A.downlink from isclient as A,isclient as B,isclient as C where A.downlink=? and A.uplink=B.downlink and B.uplink=C.downlink and C.uplink=?'
                                break;
                            case 2:
                                query2 = 'select A.downlink from isclient as A,isclient as B,isclient as C where A.downlink=? and A.uplink=B.downlink and B.uplink=?'
                                break;
                            case 1:
                                query2 = 'select downlink from isclient where downlink=? and uplink=?'
                        }
                    }
                    pool.query(query2, [data.username, data.my_username], (err, result, fields) => {
                        if (err)
                            callback(err);
                        else {

                            if (!result.length) {
                                callback(null, false)
                                return
                            }

                            let query3 = 'select A.username,A.fullname,A.usertype,A.credit_limit,A.balance,A.winnings,A.exposure,A.commission,A.suspended,A.bet_suspended,B.uplink from users as A,isclient as B where A.username=B.downlink and B.uplink=?';

                            pool.query(query3, [data.username], (err, result, fields) => {
                                if (err)
                                    callback(err);
                                else {
                                    callback(null, result);
                                }
                            });
                        }
                    })
                }
            })
        }
    },
    changePassword: (data, callback) => {

        if (data.username.toLowerCase() === 'admin') {

            const query = "update admin set password=? where username=?"
            pool.query(query, [data.new_password, data.username], (err, result, fields) => {

                if (err)
                    callback(err);
                else
                    callback(null, result);
            });

        } else {
            const query1 = 'select suspended from users where username=?'
            pool.query(query1, [data.username], (err, result, fields) => {
                if (err)
                    callback(err);
                else {
                    if (result[0].suspended) {
                        callback(null, false)
                    }
                    else {
                        const query2 = 'select password_changed from users where username=?'
                        pool.query(query2, [data.username], (err, result2, fields) => {
                            if (err) {
                                callback(err);
                            }
                            else {
                                let query3
                                if (result2[0].password_changed) {
                                    query3 = 'update users set password=?,password_changed="0" where username=?';
                                }
                                else {
                                    query3 = 'update users set password=? where username=?';
                                }

                                pool.query(query3, [data.new_password, data.username], (err, result3, fields) => {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null, true);
                                    }
                                });
                            }
                        });
                    }
                }
            })
        }
    },
    resetPassword: (data, callback) => {

        if (data.my_username.toLowerCase() === 'admin') {
            const query = 'update users set password=?,password_changed="1" where username=?';
            pool.query(query, [data.new_password, data.username], (err, result, fields) => {
                if (err)
                    callback(err);
                else
                    callback(null, 'Password Reset Successfully');
            });
        } else {
            const query1 = 'select suspended from users where username=?'
            pool.query(query1, [data.my_username], (err, result, fields) => {
                if (err)
                    callback(err);
                else {
                    if (result[0].suspended) {
                        callback(null, 'Your account has been suspended! Contact upline')
                    }
                    else {
                        const query = 'update users set password=?,password_changed="1" where username=?';
                        pool.query(query, [data.new_password, data.username], (err, result, fields) => {
                            if (err)
                                callback(err);
                            else {
                                callback(null, 'Password Reset Successfully');
                            }
                        });
                    }
                }
            })
        }
    },
    limitRisk: async (data, callback) => {

        let my_usertype = '1'

        if (data.my_username.toLowerCase() !== 'admin') {

            const query1 = 'select suspended,usertype from users where username=?'
            const response = await pool.query(query1, [data.my_username])
            my_usertype = response[0].usertype

            if (response[0].suspended) {
                callback(null, 'Your account has been suspended! Contact upline')
                return
            }
        }

        const query2 = 'select last_up_by from limitmap where username=? and event_type=?'
        pool.query(query2, [data.username, data.event_type], (err, result1, fields) => {

            if (err)
                callback(err);
            else {

                let queries = [], queryValues = []

                let query3
                let query4 = 'update limitmap set last_up_by=? where event_type=? and username=?'

                if (data.all) {

                    if (result1[0].last_up_by === 'def' || parseFloat(my_usertype) <= parseFloat(result1[0].last_up_by)) {

                        if (my_usertype === '1') {
                            query3 = 'update limitrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),adv_max_profit=IF(?<=default(adv_max_profit),?,adv_max_profit),adv_max_stake=IF(?<=default(adv_max_stake),?,adv_max_stake),min_odds=IF(?>=default(min_odds),?,min_odds),max_odds=IF(?<=default(max_odds),?,max_odds),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=?)'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in(select username from users where usertype="5")'

                        } else if (my_usertype === '2') {
                            query3 = 'update limitrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),adv_max_profit=IF(?<=default(adv_max_profit),?,adv_max_profit),adv_max_stake=IF(?<=default(adv_max_stake),?,adv_max_stake),min_odds=IF(?>=default(min_odds),?,min_odds),max_odds=IF(?<=default(max_odds),?,max_odds),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?))))'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?)))'

                        } else if (my_usertype === '3') {
                            query3 = 'update limitrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),adv_max_profit=IF(?<=default(adv_max_profit),?,adv_max_profit),adv_max_stake=IF(?<=default(adv_max_stake),?,adv_max_stake),min_odds=IF(?>=default(min_odds),?,min_odds),max_odds=IF(?<=default(max_odds),?,max_odds),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink= ?)))'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?))'

                        } else if (my_usertype === '4') {
                            query3 = 'update limitrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),adv_max_profit=IF(?<=default(adv_max_profit),?,adv_max_profit),adv_max_stake=IF(?<=default(adv_max_stake),?,adv_max_stake),min_odds=IF(?>=default(min_odds),?,min_odds),max_odds=IF(?<=default(max_odds),?,max_odds),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink =?))'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in (select downlink from isclient where uplink=?)'

                        }
                    } else {
                        if (my_usertype === '1') {
                            query3 = 'update limitrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),adv_max_profit=IF(?<=adv_max_profit,?,adv_max_profit),adv_max_stake=IF(?<=adv_max_stake,?,adv_max_stake),min_odds=IF(?>=min_odds,?,min_odds),max_odds=IF(?<=max_odds,?,max_odds),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=?)'

                        } else if (my_usertype === '2') {
                            query3 = 'update limitrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),adv_max_profit=IF(?<=adv_max_profit,?,adv_max_profit),adv_max_stake=IF(?<=adv_max_stake,?,adv_max_stake),min_odds=IF(?>=min_odds,?,min_odds),max_odds=IF(?<=max_odds,?,max_odds),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?))))'

                        } else if (my_usertype === '3') {
                            query3 = 'update limitrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),adv_max_profit=IF(?<=adv_max_profit,?,adv_max_profit),adv_max_stake=IF(?<=adv_max_stake,?,adv_max_stake),min_odds=IF(?>=min_odds,?,min_odds),max_odds=IF(?<=max_odds,?,max_odds),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink= ?)))'

                        } else if (my_usertype === '4') {
                            query3 = 'update limitrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),adv_max_profit=IF(?<=adv_max_profit,?,adv_max_profit),adv_max_stake=IF(?<=adv_max_stake,?,adv_max_stake),min_odds=IF(?>=min_odds,?,min_odds),max_odds=IF(?<=max_odds,?,max_odds),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink =?))'
                        }
                    }

                } else {
                    if (result1[0].last_up_by === 'def' || parseFloat(my_usertype) <= parseFloat(result1[0].last_up_by)) {
                        query3 = 'update limitrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),adv_max_profit=IF(?<=default(adv_max_profit),?,adv_max_profit),adv_max_stake=IF(?<=default(adv_max_stake),?,adv_max_stake),min_odds=IF(?>=default(min_odds),?,min_odds),max_odds=IF(?<=default(max_odds),?,max_odds),timer=IF(?>=default(timer),?,timer) where id =(select id from limitmap where event_type=? and username =?)'
                    } else {
                        query3 = 'update limitrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),adv_max_profit=IF(?<=adv_max_profit,?,adv_max_profit),adv_max_stake=IF(?<=adv_max_stake,?,adv_max_stake),min_odds=IF(?>=min_odds,?,min_odds),max_odds=IF(?<=max_odds,?,max_odds),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username=?)'
                    }
                }

                queries.push(query3, query4)

                queryValue1 = [data.min_stake, data.min_stake, data.max_stake, data.max_stake, data.max_profit, data.max_profit, data.adv_max_profit, data.adv_max_profit, data.adv_max_stake, data.adv_max_stake, data.min_odds, data.min_odds, data.max_odds, data.max_odds, data.timer, data.timer, data.event_type, data.all ? data.my_username : data.username]
                queryValue2 = [data.default ? 'def' : my_usertype, data.event_type, data.all ? data.my_username : data.username]

                queryValues.push(queryValue1, queryValue2)

                pool.query(queries[0], queryValues[0], (err, result, fields) => {

                    if (err)
                        callback(err);
                    else {
                        const isChanged = parseFloat(result.message.split(' ')[5])
                        if (isChanged) {
                            pool.query(queries[1], queryValues[1], (err, result, fields) => {

                                if (err)
                                    callback(err);
                                else {
                                    callback(null, 'Constraints updated successfully')
                                }
                            })
                        } else {
                            callback(null, 'Nothing changed')
                        }
                    }
                })
            }
        })
    },
    limitFancyRisk: async (data, callback) => {

        let my_usertype = '1'

        if (data.my_username.toLowerCase() !== 'admin') {

            const query1 = 'select suspended,usertype from users where username=?'
            const response = await pool.query(query1, [data.my_username])
            my_usertype = response[0].usertype

            if (response[0].suspended) {
                callback(null, 'Your account has been suspended! Contact upline')
                return
            }
        }

        const query2 = 'select last_up_by from limitmap where username=? and event_type=?'
        pool.query(query2, [data.username, data.event_type], (err, result1, fields) => {

            if (err)
                callback(err);
            else {

                let queries = [], queryValues = []

                let query3
                let query4 = 'update limitmap set last_up_by=? where event_type=? and username=?'

                if (data.all) {

                    if (result1[0].last_up_by === 'def' || parseFloat(my_usertype) <= parseFloat(result1[0].last_up_by)) {

                        if (my_usertype === '1') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=?)'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in(select username from users where usertype="5")'

                        } else if (my_usertype === '2') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?))))'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in(select username from users where usertype="5")'

                        } else if (my_usertype === '3') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink= ?)))'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?))'

                        } else if (my_usertype === '4') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),timer=IF(?>=default(timer),?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink =?))'
                            query4 = 'update limitmap set last_up_by=? where event_type=? and username in (select downlink from isclient where uplink=?)'

                        }
                    } else {
                        if (my_usertype === '1') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=?)'

                        } else if (my_usertype === '2') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?))))'

                        } else if (my_usertype === '3') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink= ?)))'

                        } else if (my_usertype === '4') {
                            query3 = 'update limitfancyrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username in (select downlink from isclient where uplink =?))'
                        }
                    }

                } else {
                    if (result1[0].last_up_by === 'def' || parseFloat(my_usertype) <= parseFloat(result1[0].last_up_by)) {
                        query3 = 'update limitfancyrisk set min_stake=IF(?>=default(min_stake),?,min_stake),max_stake=IF(?<=default(max_stake),?,max_stake),max_profit=IF(?<=default(max_profit),?,max_profit),timer=IF(?>=default(timer),?,timer) where id =(select id from limitmap where event_type=? and username =?)'
                    } else {
                        query3 = 'update limitfancyrisk set min_stake=IF(?>=min_stake,?,min_stake),max_stake=IF(?<=max_stake,?,max_stake),max_profit=IF(?<=max_profit,?,max_profit),timer=IF(?>=timer,?,timer) where id in(select id from limitmap where event_type=? and username=?)'
                    }
                }

                queries.push(query3, query4)

                queryValue1 = [data.min_stake, data.min_stake, data.max_stake, data.max_stake, data.max_profit, data.max_profit, data.timer, data.timer, data.event_type, data.all ? data.my_username : data.username]
                queryValue2 = [data.default ? 'def' : my_usertype, data.event_type, data.all ? data.my_username : data.username]

                queryValues.push(queryValue1, queryValue2)

                pool.query(queries[0], queryValues[0], (err, result, fields) => {

                    if (err)
                        callback(err);
                    else {
                        const isChanged = parseFloat(result.message.split(' ')[5])
                        if (isChanged) {
                            pool.query(queries[1], queryValues[1], (err, result, fields) => {

                                if (err)
                                    callback(err);
                                else {
                                    callback(null, 'Constraints updated successfully')
                                }
                            })
                        } else {
                            callback(null, 'Nothing changed')
                        }
                    }
                })
            }
        })
    },
    allConstraints: (data, callback) => {

        let query

        if (data.event_type === '5') {
            query = 'select * from limitfancyrisk where id=(select id from limitmap where username=? and event_type=?)'
        } else {
            query = 'select * from limitrisk where id=(select id from limitmap where username=? and event_type=?)'
        }

        pool.query(query, [data.username, data.event_type], (err, result2, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result2);
        });
    },
    getDefautConstraints: async (data, callback) => {

        let my_usertype

        if (data.my_username.toLowerCase() !== 'admin') {

            const query1 = 'select usertype from users where username=?'
            const response = await pool.query(query1, [data.my_username])
            my_usertype = response[0].usertype

        }

        const query1 = 'select last_up_by from limitmap where username=? and event_type=?'
        pool.query(query1, [data.username, data.event_type], (err, result1, fields) => {

            if (err)
                callback(err);
            else {

                if (result1[0].last_up_by !== 'def' && parseFloat(my_usertype) > parseFloat(result1[0].last_up_by)) {

                    callback(null, false)

                } else {

                    let query

                    if (data.event_type === '5') {
                        query = 'select default(min_stake) as min_stake,default(max_stake) as max_stake,default(max_profit) as max_profit,default(timer) as timer from limitfancyrisk where id=(select id from limitmap where username=? and event_type=?)'
                    } else {
                        query = 'select default(min_stake) as min_stake,default(max_stake) as max_stake,default(max_profit) as max_profit,default(adv_max_profit) as adv_max_profit,default(adv_max_stake) as adv_max_stake,default(min_odds) as min_odds,default(max_odds) as max_odds,default(timer) as timer from limitrisk where id=(select id from limitmap where username=? and event_type=?)'
                    }

                    pool.query(query, [data.username, data.event_type], (err, result2, fields) => {
                        if (err)
                            callback(err);
                        else
                            callback(null, result2);
                    });
                }
            }
        })
    },
    deleteUser: (username, callback) => {

        const queries = [], queryValues = []

        const query1 = 'delete from users where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))'
        const query2 = 'delete from users where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?))'
        const query3 = 'delete from users where username in (select downlink from isclient where uplink=?)'
        const query4 = 'delete from users where username=?'
        queries.push(query1, query2, query3, query4)

        const queryValue1 = [username]
        const queryValue2 = [username]
        const queryValue3 = [username]
        const queryValue4 = [username]
        queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4)

        transaction(queries, queryValues, (err, result) => {

            if (err)
                callback(err);
            else
                callback(null, "User deleted successfully");
        });
    },
    getMatches: (callback) => {

        client.get('matches', (err, matches) => {

            if (err)
                return callback(err)
            else if (matches)
                return callback(null, JSON.parse(matches))

            const query = 'select B.name as matchName,B.id as matchId,A.cupRate,C.id as marketId,C.marketStartTime,A.sport ' +
                'from series as A,matches as B,market as C ' +
                'where B.status="on" and A.id=B.series_id and B.id=C.match_id and C.name="Match Odds" or B.status="on" and A.id=B.series_id and B.id=C.match_id and A.cupRate=B.id and A.cupRate is not null ' +
                'order by C.marketStartTime asc '

            pool.query(query, (err, result, fields) => {
                if (err)
                    return callback(err);

                client.set('matches', JSON.stringify(result), (err) => {

                    if (err)
                        return callback(err);
                    callback(null, result);
                })
            });
        })
    },
    getInplayMatches: (callback) => {

        client.get('inplayMatches', (err, matches) => {

            if (err)
                return callback(err)
            else if (matches)
                return callback(null, JSON.parse(matches))

            const query = 'select B.name as matchName,B.id as matchId,A.cupRate,C.id as marketId,C.marketStartTime,A.sport ' +
                'from series as A,matches as B,market as C ' +
                'where B.status="on" and A.id=B.series_id and B.id=C.match_id and C.name="Match Odds" or B.status="on" and A.id=B.series_id and B.id=C.match_id and A.cupRate=B.id and A.cupRate is not null ' +
                'order by C.marketStartTime asc '

            pool.query(query, async (err, result, fields) => {
                if (err)
                    return callback(err);

                let marketIds = ''

                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    marketIds = (marketIds === '' ? '' : (marketIds + ',')) + element.marketId
                }

                try {

                    const res = await axios.get('/getOdds/' + marketIds)
                    const odds = res.data.data
                    result = result.filter(market => {
                        const marketOdd = odds.filter(odd => odd.marketId === market.marketId)
                        return marketOdd.length ? marketOdd[0].inplay : false
                    })

                } catch (err) {
                    console.log(err);
                }

                client.set('inplayMatches', JSON.stringify(result), 'EX', 60, (err) => {

                    if (err)
                        return callback(err);

                    callback(null, result);
                })
            });
        })
    },
    getMatchesBySport: (sport, callback) => {

        const key = {
            type: 'match',
            sport: sport
        }

        client.get(JSON.stringify(key), (err, matches) => {

            if (err)
                return callback(err)
            else if (matches)
                return callback(null, JSON.parse(matches))

            const query = 'select B.name as matchName,B.id as matchId,A.cupRate,C.id as marketId,C.marketStartTime ' +
                'from series as A,matches as B,market as C ' +
                'where A.sport=? and B.status="on" and A.id=B.series_id and B.id=C.match_id and C.name="Match Odds" or A.sport=? and B.status="on" and A.id=B.series_id and B.id=C.match_id and A.cupRate=B.id and A.cupRate is not null ' +
                'order by C.marketStartTime asc '
            pool.query(query, [sport, sport], (err, result, fields) => {
                if (err)
                    return callback(err);

                client.set(JSON.stringify(key), JSON.stringify(result), (err) => {

                    if (err)
                        return callback(err);

                    callback(null, result);
                })

            });
        })
    },
    getMarketsByMatch: (data, callback) => {

        client.get(data.matchId, async (err, markets) => {

            if (err)
                return callback(err)
            else if (markets)
                return callback(null, JSON.parse(markets))

            const query1 = 'select min_stake,max_stake,adv_max_stake from limitrisk where id=(select id from limitmap where username=? and event_type=(select sport from series where id in(select series_id from matches where id=?)))'
            let result1 = await pool.query(query1, [data.username, data.matchId])

            const query2 = 'select * from market where status="on" and match_id=?'
            pool.query(query2, [data.matchId], async (err, result, fields) => {
                if (err)
                    callback(err);
                else {
                    for (const market of result) {

                        if (result1.length) {
                            market.min = result1[0].min_stake > market.min ? result1[0].min_stake : market.min
                            // market.max = result1[0].max_stake < market.max_stake ? result1[0].max_stake : market.max
                            market.adv_max = result1[0].adv_max_stake < market.adv_max ? result1[0].adv_max_stake : market.adv_max
                        }

                        try {
                            const query3 = 'select back,lay,selectionId,name from runner where market_id=?'
                            let res = await pool.query(query3, [market.id])

                            const marketRunners = []
                            const runners = []
                            for (const runner of res) {

                                marketRunners.push({
                                    selectionId: runner.selectionId,
                                    name: runner.name
                                })

                                if (market.manual === 'yes') {

                                    runners.push({
                                        selectionId: runner.selectionId,
                                        status: 'ACTIVE',
                                        ex: {
                                            availableToBack: [
                                                { price: runner.back, size: '250000' },
                                                { price: 0, size: "0.00" },
                                                { price: 0, size: "0.00" }
                                            ],
                                            availableToLay: [
                                                { price: runner.lay, size: '250000' },
                                                { price: 0, size: "0.00" },
                                                { price: 0, size: "0.00" }
                                            ]
                                        }
                                    })
                                }
                            }
                            if (market.manual === 'yes') {
                                const odds = [
                                    {
                                        inplay: true,
                                        status: 'ACTIVE',
                                        runners: runners
                                    }
                                ]
                                market.odds = odds
                            }

                            market.runners = [...marketRunners]

                        } catch (err) {
                            return callback(err)
                        }

                    }
                    client.set(data.matchId, JSON.stringify(result), 'EX', 60 * 60, (err) => {

                        if (err)
                            return callback(err);

                        callback(null, result);
                    })
                }
            });
        })
    },
    matchInfo: (eventId, callback) => {

        const key = {
            type: 'info',
            eventId: eventId
        }

        client.get(JSON.stringify(key), (err, info) => {

            if (err) {
                return callback(err)
            }

            if (info) {
                return callback(null, JSON.parse(info))
            }

            const query = 'select A.openDate,A.name,B.sport from matches as A,series as B where A.id=? and A.series_id=B.id'
            pool.query(query, [eventId], (err, result) => {

                if (err)
                    return callback(err)

                if (!result.length) {
                    return callback(null, result);
                }

                client.set(JSON.stringify(key), JSON.stringify(result), 'EX', 60 * 60, (err) => {

                    if (err)
                        return callback(err);

                    callback(null, result);
                })
            })

        })


    },
    getRunnersByMarket: (marketId, callback) => {

        client.get(marketId, (err, runners) => {

            if (err) {
                return callback(err)
            }

            if (runners) {
                return callback(null, JSON.parse(runners))
            }

            const query = 'select * from runner where market_id=?'
            pool.query(query, [marketId], (err, result, fields) => {
                if (err)
                    return callback(err);

                client.set(marketId, JSON.stringify(result), 'EX', 60 * 60, (err) => {

                    if (err)
                        return callback(err);

                    callback(null, result);
                })
            });
        })
    },
    getRunnerProfitLoss: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {
            query1 = 'select -sum(netProfit) as netProfit ' +
                'from clientbook where runner=? and id in ( select id from clientbookmap where event=? and market=?)'
        } else {

            const query2 = 'select usertype from users where username=?'
            const response = await pool.query(query2, [data.username])
            usertype = response[0].usertype

            switch (usertype) {

                case '2':
                    query1 = 'select -sum(netProfit) as netProfit ' +
                        'from clientbook where runner=? and id in ( select id from clientbookmap where event=? and market=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?))))'
                    break
                case '3':
                    query1 = 'select -sum(netProfit) as netProfit ' +
                        'from clientbook where runner=? and id in ( select id from clientbookmap where event=? and market=? and username in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))'
                    break
                case '4':
                    query1 = 'select -sum(netProfit) as netProfit ' +
                        'from clientbook where runner=? and id in ( select id from clientbookmap where event=? and market=? and username in (select downlink from isclient where uplink =?))'
                    break
                case '5':
                    query1 = 'select netProfit from clientbook where runner=? and id in (select id from clientbookmap where event=? and market=? and username=?)'
            }
        }

        pool.query(query1, [data.runner, data.event, data.market, data.username], (error, results, fields) => {
            if (error)
                callback(error)
            else {
                callback(null, results.length ? results[0].netProfit : 0, usertype)
            }
        })
    },
    getFancyMaxMin: (data, callback) => {

        const query1 = 'select max,min,status from fancy where id=?'
        pool.query(query1, [data.matchId], (err, result1, fields) => {
            if (err)
                callback(err);
            else {
                const query2 = 'select min_stake,max_stake from limitfancyrisk where id=(select id from limitmap where username=? and event_type=?)'
                pool.query(query2, [data.username, data.event_type], (err, result2, fields) => {
                    if (err)
                        callback(err);
                    else {

                        if (result2.length && result1.length) {

                            let obj = {}
                            let result = []
                            obj.min = result1[0].min > result2[0].min_stake ? result1[0].min : result2[0].min_stake
                            obj.max = result1[0].max < result2[0].max_stake ? result1[0].max : result2[0].max_stake
                            obj.status = result1[0].status
                            result.push(obj)
                            callback(null, result)
                        } else {
                            callback(null, result1)
                        }
                    }
                })
            }
        });
    },
    getCurrentBetsByEvent: async (data, callback) => {

        query1 = 'select B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
            'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
            'where A.bet_id=B.bet_id and A.event_id=? and A.state="matched" and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink ' +
            'order by A.placed_at desc'

        if (data.username.toLowerCase() !== 'admin') {

            const query2 = 'select usertype from users where username=?'
            const response = await pool.query(query2, [data.username])
            const usertype = response[0].usertype

            switch (usertype) {

                case '2':
                    query1 = 'select B.username,C.uplink as master,D.uplink as supermaster,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.state="matched" and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and E.uplink=? ' +
                        'order by A.placed_at desc'
                    break
                case '3':
                    query1 = 'select B.username,C.uplink as master,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.state="matched" and B.username=C.downlink and C.uplink=D.downlink and D.uplink=? ' +
                        'order by A.placed_at desc'
                    break
                case '4':
                    query1 = 'select B.username,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.state="matched" and B.username=C.downlink and C.uplink=? ' +
                        'order by A.placed_at desc'
                    break
                case '5':
                    query1 = 'select A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and B.username=? and A.state="matched"' +
                        'order by A.placed_at desc'
                    break
            }
        }
        pool.query(query1, [data.eventId, data.username], (err, result, fields) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
    getFancyBetsByEvent: async (data, callback) => {

        query1 = 'select B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
            'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
            'where A.bet_id=B.bet_id and A.event_id=? and A.type="fancy" and A.state="matched" and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink ' +
            'order by A.placed_at desc'

        if (data.username.toLowerCase() !== 'admin') {

            const query2 = 'select usertype from users where username=?'
            const response = await pool.query(query2, [data.username])
            const usertype = response[0].usertype

            switch (usertype) {

                case '2':
                    query1 = 'select B.username,C.uplink as master,D.uplink as supermaster,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.type="fancy" and A.state="matched" and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and E.uplink=? ' +
                        'order by A.placed_at desc'
                    break
                case '3':
                    query1 = 'select B.username,C.uplink as master,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.type="fancy" and A.state="matched" and B.username=C.downlink and C.uplink=D.downlink and D.uplink=? ' +
                        'order by A.placed_at desc'
                    break
                case '4':
                    query1 = 'select B.username,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.type="fancy" and A.state="matched" and B.username=C.downlink and C.uplink=? ' +
                        'order by A.placed_at desc'
                    break
                case '5':
                    query1 = 'select A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.type,A.IP_Address ' +
                        'from bets as A,betmap as B ' +
                        'where A.bet_id=B.bet_id and A.event_id=? and A.type="fancy" and B.username=? and A.state="matched"' +
                        'order by A.placed_at desc'
                    break
            }
        }
        pool.query(query1, [data.eventId, data.username], (err, result, fields) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
    getMarketAnanlysis: (data, callback) => {

        let query1

        switch (data.usertype) {
            case '1':
                query1 = 'select C.uplink as downlink ' +
                    'from isclient as A,isclient as B,isclient as C ' +
                    'where A.uplink=B.downlink and B.uplink=C.downlink and A.downlink in(select username from clientbookmap where event=? and market=?) group by C.uplink';
                break;
            case '2':
                query1 = 'select C.downlink ' +
                    'from isclient as A,isclient as B,isclient as C ' +
                    'where A.uplink=B.downlink and B.uplink=C.downlink and A.downlink in(select username from clientbookmap where event=? and market=?) and C.uplink=? group by C.downlink';
                break;
            case '3':
                query1 = 'select B.downlink ' +
                    'from isclient as A,isclient as B ' +
                    'where A.uplink=B.downlink and A.downlink in(select username from clientbookmap where event=? and market=?) and B.uplink=? group by B.downlink';
                break;
            case '4':
                query1 = 'select downlink ' +
                    'from isclient ' +
                    'where downlink in(select username from clientbookmap where event=? and market=?) and uplink=? group by downlink';
                break;
        }

        pool.query(query1, [data.event, data.market, data.username], async (error, results, fields) => {
            if (error) {
                callback(error);
            }
            else {
                const myres = [];

                try {

                    const query1 = 'select selectionId,name from runner where market_id=?'
                    const runners = await pool.query(query1, [data.market])
                    for (const user of results) {
                        const myrunners = [];
                        for (const runner of runners) {

                            let query2

                            switch (data.usertype) {
                                case '1':
                                    query2 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username in(select downlink from isclient where uplink in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?))))'
                                    break;
                                case '2':
                                    query2 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?)))'
                                    break;
                                case '3':
                                    query2 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username in(select downlink from isclient where uplink=?))'
                                    break;
                                case '4':
                                    query2 = 'select sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username=?)'
                                    break;
                                default:
                                    break;
                            }

                            let res = await pool.query(query2, [runner.selectionId, data.event, data.market, user.downlink])
                            runner.netProfit = res[0].netProfit
                            myrunners.push({
                                ...runner,
                                netProfit: res[0].netProfit
                            })
                        }
                        myres.push({
                            ...user,
                            runners: myrunners
                        })
                    }
                } catch (err) {
                    callback(err)
                }

                callback(null, myres);
            }
        })
    },
    runningMarketAnanlysis: async (data, callback) => {

        let usertype

        if (data.username.toLowerCase() === 'admin') {
            usertype = '1'
        } else {
            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }
        }

        let query1

        switch (usertype) {
            case '1':
                query1 = 'select event,event_id,market,market_id,sport from bets where state="matched" and type!="fancy" group by event,event_id,market,market_id,sport'
                break;
            case '2':
                query1 = 'select A.event,A.event_id,A.market,A.market_id,A.sport from bets as A,betmap as B where state="matched" and type!="fancy" and A.bet_id=B.bet_id and B.username in (select downlink from isclient where uplink in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?))) group by A.event,A.event_id,A.market,A.market_id,A.sport'
                break;
            case '3':
                query1 = 'select A.event,A.event_id,A.market,A.market_id,A.sport from bets as A,betmap as B where state="matched" and type!="fancy" and A.bet_id=B.bet_id and B.username in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?)) group by A.event,A.event_id,A.market,A.market_id,A.sport'
                break;
            case '4':
                query1 = 'select A.event,A.event_id,A.market,A.market_id,A.sport from bets as A,betmap as B where state="matched" and type!="fancy" and A.bet_id=B.bet_id and B.username in (select downlink from isclient where uplink=?) group by A.event,A.event_id,A.market,A.market_id,A.sport'
                break;
            case '5':
                query1 = 'select A.event,A.event_id,A.market,A.market_id,A.sport from bets as A,betmap as B where state="matched" and type!="fancy" and A.bet_id=B.bet_id and B.username=? group by A.event,A.event_id,A.market,A.market_id,A.sport'
                break;
        }

        pool.query(query1, [data.username], async (error, results, fields) => {
            if (error) {
                callback(error);
            }
            else {
                const myres = [];

                try {

                    for (const market of results) {

                        const query2 = 'select selectionId,name from runner where market_id=?'
                        const runners = await pool.query(query2, [market.market_id])
                        const myrunners = [];
                        for (const runner of runners) {

                            let query3

                            switch (usertype) {
                                case '1':
                                    query3 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=?)'
                                    break;
                                case '2':
                                    query3 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username in(select downlink from isclient where uplink in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?))))'
                                    break;
                                case '3':
                                    query3 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username in(select downlink from isclient where uplink in (select downlink from isclient where uplink=?)))'
                                    break;
                                case '4':
                                    query3 = 'select -sum(netProfit) as netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username in (select downlink from isclient where uplink=?))'
                                    break;
                                case '5':
                                    query3 = 'select netProfit ' +
                                        'from clientbook ' +
                                        'where runner=? and id in(select id from clientbookmap where event=? and market=? and username=?)'
                                    break;

                                default:
                                    break;
                            }

                            let res = await pool.query(query3, [runner.selectionId, market.event_id, market.market_id, data.username])
                            runner.netProfit = res[0].netProfit
                            myrunners.push({
                                ...runner,
                                netProfit: res[0].netProfit
                            })
                        }
                        myres.push({
                            ...market,
                            runners: myrunners
                        })
                    }
                } catch (err) {
                    callback(err)
                }

                callback(null, myres);
            }
        })
    },
    createMatched: (data, callback) => {

        if (data.usertype !== '5')
            return callback(null, "You can't bet on this match", false)

        client.get(data.c_username, (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Bet processing...', false)

            client.set(data.c_username, '1', async (err) => {
                if (err)
                    return callback(err)

                let min, adv_max, restriction, timer, any_odds = 0
                //let max
                try {

                    if (data.marketName.toLowerCase() !== 'bookmaker') {
                        const query1 = 'select any_odds from users where username=?'
                        const response = await pool.query(query1, [data.c_username])
                        any_odds = response[0].any_odds
                    }

                    const query2 = 'select * from limitrisk where id=(select id from limitmap where username=? and event_type=?)';
                    const res = await pool.query(query2, [data.c_username, data.sport])

                    if (res[0].status === 'off')
                        return callback(null, 'Sorry market is closed', false)
                    else if (res[0].min_odds > data.odds || res[0].max_odds < data.odds)
                        return callback(null, 'Min/Max odds constraint violated', false)

                    timer = res[0].timer
                    min = res[0].min_stake
                    //max = res[0].max_stake
                    adv_max = res[0].adv_max_stake
                    restriction = {
                        max_profit: res[0].max_profit,
                        adv_max_profit: res[0].adv_max_profit
                    }

                } catch (err) {
                    callback(err)
                    return
                }

                const firstQuery = 'select A.status,A.max,A.adv_max,A.min,A.manual,B.timer from market as A,matches as B where A.id=? and A.match_id=? and A.match_id=B.id';
                pool.query(firstQuery, [data.market, data.event], (err, result, fields) => {
                    if (err)
                        return callback(err)

                    if (!result.length)
                        return callback(null, "Market doesn't exist!", false)

                    else if ((data.inplay ? result[0].max < data.stake : result[0].adv_max < data.stake || adv_max < data.stake) || result[0].min > data.stake || min > data.stake)
                        return callback(null, "Min/Max stake constraint violated", false)

                    else if (result[0].status === 'off')
                        return callback(null, 'Sorry market is closed', false)


                    if (data.marketName.toLowerCase() === 'bookmaker')
                        timer = 1

                    else if (timer < result[0].timer)
                        timer = result[0].timer

                    const reqData = {
                        event: data.event,
                        market: data.market,
                        runner: data.runner,
                        c_username: data.c_username,
                        manual: result[0].manual
                    }
                    eventAndClientInfo(reqData, async (err, res, curProfit) => {
                        if (err)
                            return callback(err)

                        let canPass
                        if (!res.length)
                            canPass = await calculateNewBetValidation(curProfit, data.odds, data.selection, data.stake, data.inplay, restriction, data.c_username);
                        else
                            canPass = calculateBetValidation(curProfit, res, data.runner, data.odds, data.selection, data.stake, data.inplay, restriction);


                        if (!canPass.isValid) {
                            callback(null, canPass.message, false)
                            return;
                        }

                        setTimeout(async () => {

                            if (result[0].manual === 'no') {

                                let odds
                                try {

                                    const params = data.marketName.toLowerCase() === 'bookmaker' ? data.market + '/' + data.market : data.market
                                    odds = await axios.get('/getOdds/' + params)

                                } catch (err) {
                                    return callback(null, 'Bet not placed because odds not reliable', false)
                                }

                                if (!odds.data.data.length)
                                    return callback(null, 'Bet not placed because odds changed', false)

                                const marketStatus = odds.data.data[0].status
                                const runnerStatus = odds.data.data[0].runners.filter(runner => runner.selectionId === parseFloat(data.runner))[0].status
                                odds = odds.data.data[0].runners.filter(runner => runner.selectionId === parseFloat(data.runner))[0].ex
                                // console.log("odds",odds)
                                // console.log("data.odds",data.odds)
                                // console.log("backodds",odds.availableToBack[0].price)
                                // console.log("layodds",odds.availableToLay[0].price)
                                if ((runnerStatus !== 'ACTIVE' && marketStatus !== 'OPEN') || marketStatus === 'SUSPENDED' || marketStatus === 'INACTIVE')
                                    return callback(null, 'Bet not placed because odds changed', false)

                                else if ((data.selection === 'back' && odds.availableToBack[0].price < 1.01) || (data.selection === 'lay' && odds.availableToLay[0].price < 1.01))
                                    return callback(null, 'Bet not placed because odds changed-condition-3', false)

                                else if (data.selection === 'back' && any_odds && (Math.abs(odds.availableToBack[0].price - data.odds) < 0.04))
                                    data.odds = odds.availableToBack[0].price

                                else if (data.selection === 'lay' && any_odds && (Math.abs(odds.availableToLay[0].price - data.odds) < 0.04))
                                    data.odds = odds.availableToLay[0].price

                                else if (data.selection === 'back' && odds.availableToBack[0].price >= data.odds)
                                    data.odds = Math.round(((odds.availableToBack[0].price + data.odds) / 2) * 100) / 100

                                else if (data.marketName.toLowerCase() === 'bookmaker' && data.selection === 'lay' && parseFloat((odds.availableToBack[0].price + 0.01).toFixed(2)) <= data.odds)
                                    data.odds = Math.round(((parseFloat((odds.availableToBack[0].price + 0.01).toFixed(2)) + data.odds) / 2) * 100) / 100

                                else if (data.selection === 'lay' && odds.availableToLay[0].price <= data.odds)
                                    data.odds = Math.round(((odds.availableToLay[0].price + data.odds) / 2) * 100) / 100

                                else return callback(null, 'Bet not placed because odds changed', false)

                            }


                            if (data.selection === 'back') {
                                data.profit = data.stake * (data.odds - 1);
                                data.liability = -data.stake
                            }
                            else {
                                data.profit = data.stake
                                data.liability = -data.stake * (data.odds - 1)
                            }

                            data.profit = Math.round(data.profit * 100) / 100
                            data.liability = Math.round(data.liability * 100) / 100

                            const sports = [{ id: '4', name: 'Cricket' }, { id: '1', name: 'Soccer' }, { id: '2', name: 'Tennis' }]
                            const sportName = sports.filter(sport => sport.id === data.sport)[0].name

                            const queries = [], queryValues = [];
                            const query = 'select * from clientbookmap where username=? and event=? and market=?'

                            pool.query(query, [data.c_username, data.event, data.market], (err, results, fields) => {
                                if (err)
                                    return callback(err)

                                if (!results.length) {

                                    const query1 = 'update users set balance=balance-?,exposure=exposure+? where username=?';
                                    const query2 = 'insert into betmap(username) values(?)';
                                    const query3 = 'SET @betId = LAST_INSERT_ID()';
                                    const query4 = 'insert into bets (bet_id,sport,event_id,event,market,market_id,runner,runner_id,odds,selection,state,stake,type,IP_Address,placed_at) values(@betId,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                    const query5 = 'insert into clientbookmap (username,event,market) values(?,?,?)';
                                    const query6 = 'SET @Id = LAST_INSERT_ID()';
                                    const query7 = 'insert into clientbook values(@Id,?,?)';
                                    const query8 = 'insert into eventexposure values(@Id,?)';
                                    queries.push(query1, query2, query3, query4, query5, query6, query7, query8);

                                    for (let i = 0; i < data.otherRunners.length; i++)
                                        queries.push('insert into clientbook values(@Id,?,?)')

                                    const bet_exposure = data.selection == 'back' ? data.stake : (data.odds - 1) * data.stake

                                    const queryValue1 = [bet_exposure, bet_exposure, data.c_username];
                                    const queryValue2 = [data.c_username];
                                    const queryValue3 = [];
                                    const queryValue4 = [sportName, data.event, data.eventName, data.marketName, data.marketId, data.runnerName, data.runner, data.odds, data.selection, 'matched', data.stake, data.type, data.IP_Address, new Date()];
                                    const queryValue5 = [data.c_username, data.event, data.market]
                                    const queryValue6 = []
                                    const queryValue7 = data.selection === 'back' ? [data.runner, data.profit] : [data.runner, data.liability]
                                    const queryValue8 = [bet_exposure];
                                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8);

                                    data.otherRunners.forEach(runner => {

                                        const queryValue = data.selection === 'back' ? [runner, data.liability] : [runner, data.profit]
                                        queryValues.push(queryValue);

                                    });

                                    transaction(queries, queryValues, (err, result) => {

                                        if (err)
                                            return callback(err);

                                        callback(null, 'Bet placed successfully', true);
                                    });
                                }
                                else {

                                    const query1 = 'insert into betmap(username) values(?)';
                                    const query2 = 'SET @betId = LAST_INSERT_ID()';
                                    const query3 = 'insert into bets (bet_id,sport,event_id,event,market,market_id,runner,runner_id,odds,selection,state,stake,type,IP_Address,placed_at) values(@betId,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                    const query4 = 'update clientbook set netProfit=netProfit+? where id =(select id from clientbookmap where username=? and event=? and market=?) and runner=?';
                                    queries.push(query1, query2, query3, query4);

                                    for (let i = 0; i < data.otherRunners.length; i++) {
                                        queries.push('update clientbook set netProfit=netProfit+? where id =(select id from clientbookmap where username=? and event=? and market=?) and runner=?');
                                    }
                                    const query5 = 'select @newEventExposure:=-min(netProfit) from clientbook where id =(select id from clientbookmap where username=? and event=? and market=?)';
                                    const query6 = 'select @oldEventExposure:=event_exposure from eventexposure where id =(select id from clientbookmap where username=? and event=? and market=?)';
                                    const query7 = 'update eventexposure set event_exposure=IF(@newEventExposure<=0,0,@newEventExposure) where id =(select id from clientbookmap where username=? and event=? and market=?)';
                                    const query8 = 'update users set ' +
                                        'balance=balance+IF(@newEventExposure<=0,@oldEventExposure,@oldEventExposure-@newEventExposure), ' +
                                        'exposure=exposure+IF(@newEventExposure<=0,-@oldEventExposure,@newEventExposure-@oldEventExposure) ' +
                                        'where username=?';
                                    queries.push(query5, query6, query7, query8);

                                    const queryValue1 = [data.c_username];
                                    const queryValue2 = [];
                                    const queryValue3 = [sportName, data.event, data.eventName, data.marketName, data.marketId, data.runnerName, data.runner, data.odds, data.selection, 'matched', data.stake, data.type, data.IP_Address, new Date()];
                                    const queryValue4 = data.selection === 'back' ? [data.profit, data.c_username, data.event, data.market, data.runner] : [data.liability, data.c_username, data.event, data.market, data.runner]

                                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4);

                                    data.otherRunners.forEach(runner => {

                                        const queryValue = data.selection === 'back' ? [data.liability, data.c_username, data.event, data.market, runner] : [data.profit, data.c_username, data.event, data.market, runner]
                                        queryValues.push(queryValue)

                                    });

                                    const queryValue5 = [data.c_username, data.event, data.market];
                                    const queryValue6 = [data.c_username, data.event, data.market];
                                    const queryValue7 = [data.c_username, data.event, data.market];
                                    const queryValue8 = [data.c_username];
                                    queryValues.push(queryValue5, queryValue6, queryValue7, queryValue8);

                                    transaction(queries, queryValues, (err, result) => {

                                        if (err)
                                            return callback(err)

                                        callback(null, 'Bet placed successfully', true)
                                    });
                                }
                            });
                        }, timer * 1000);
                    })
                })
            })
        })
    },
    createFancy: (data, callback) => {

        if (data.usertype !== '5')
            return callback(null, 2)

        client.get(data.c_username, (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Bet processing...', false)

            client.set(data.c_username, '1', async (err) => {
                if (err)
                    return callback(err)

                let min, max, restrict_profit, timer

                try {

                    const query1 = 'select * from limitfancyrisk where id=(select id from limitmap where username=? and event_type=?)';
                    const res1 = await pool.query(query1, [data.c_username, '5'])

                    if (res1[0].status === 'off')
                        return callback(null, 0)

                    timer = res1[0].timer
                    min = res1[0].min_stake
                    max = res1[0].max_stake
                    max_profit = res1[0].max_profit

                    const query2 = 'select * from blockedfancies where eventId=? and sessionId=?'
                    const res2 = await pool.query(query2, [data.event, data.runner])
                    const isBlocked = res2.length
                    if (isBlocked)
                        return callback(null, 0)

                } catch (err) {
                    return callback(err)
                }

                const firstQuery = 'select status,max,min,timer from fancy where id=?'
                pool.query(firstQuery, [data.event], (err, result1, fields) => {
                    if (err)
                        return callback(err)

                    else if (result1.length && (result1[0].status === 'off'))
                        return callback(null, 0)

                    else if (result1[0].max < data.stake || max < data.stake || result1[0].min > data.stake || min > data.stake)
                        return callback(null, 4)

                    if (result1[0].timer > timer) {
                        timer = result1[0].timer
                    }

                    const query = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username=?) ' +
                        'order by user_rate asc';

                    pool.query(query, [data.event, data.runner, data.c_username], async (err, results, fields) => {
                        if (err)
                            return callback(err);

                        let old_exposure = 0;
                        let fancyBets = [...results]
                        if (results.length) {

                            let book = fancybook(results)

                            let netProfitArray = book.map(fancy => {
                                return fancy.net_profit
                            })
                            let min = Math.min.apply(Math, netProfitArray);

                            if (min < 0) {
                                old_exposure = -min;
                            }
                        }

                        let new_exposure = 0
                        const newFancy = {
                            user_rate: parseFloat(data.user_rate),
                            odds: parseFloat(data.odds),
                            selection: data.selection,
                            stake: parseFloat(data.stake)
                        }
                        fancyBets.push(newFancy);
                        let book = fancybook(fancyBets)

                        let netProfitArray = book.map(fancy => {
                            return fancy.net_profit
                        })
                        let min = Math.min.apply(Math, netProfitArray);
                        let max_profit = Math.max.apply(Math, netProfitArray);

                        if (min < 0) {
                            new_exposure = -min;
                        }

                        const bet = {
                            old_exposure: old_exposure,
                            new_exposure: new_exposure,
                            restrict_profit: restrict_profit,
                            max_profit: max_profit,
                            username: data.c_username
                        }
                        fancyBetValidation(bet, (err, canPass) => {

                            if (err)
                                return callback(err)

                            if (!canPass.isValid)
                                return callback(null, canPass.code)

                            setTimeout(async () => {

                                let allSessions
                                try {
                                    allSessions = await axios.get('/getSession/' + data.event)
                                } catch (err) {
                                    callback(null, 9)
                                    return;
                                }

                                allSessions = allSessions.data.data.filter(session => session.SelectionId === data.runner)

                                if (!allSessions.length)
                                    return callback(null, 3)

                                allSessions = allSessions[0]

                                if (data.selection === 'back' && ((parseFloat(allSessions.BackPrice1) !== data.user_rate) || (parseFloat(allSessions.BackSize1) !== data.odds)))
                                    return callback(null, 3)

                                else if (data.selection === 'lay' && ((parseFloat(allSessions.LayPrice1) !== data.user_rate) || (parseFloat(allSessions.LaySize1) !== data.odds)))
                                    return callback(null, 3)

                                const sports = [{ id: '4', name: 'Cricket' }, { id: '1', name: 'Soccer' }, { id: '2', name: 'Tennis' }]
                                const sportName = sports.filter(sport => sport.id === data.sport)[0].name

                                const queries = [], queryValues = []

                                const query1 = 'insert into betmap(username) values(?)';
                                const query2 = 'SET @betId = LAST_INSERT_ID()';
                                const query3 = 'insert into bets (bet_id,sport,event,runner,event_id,runner_id,user_rate,odds,selection,type,state,stake,IP_Address,placed_at) values(@betId,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                const query4 = 'update users set balance=balance+?, exposure=exposure+? where username=?';
                                queries.push(query1, query2, query3, query4)

                                const queryValue1 = [data.c_username];
                                const queryValue2 = [];
                                const queryValue3 = [sportName, data.eventName, data.runnerName, data.event, data.runner, data.user_rate, data.odds, data.selection, data.type, 'matched', data.stake, data.IP_Address, new Date()];
                                const queryValue4 = [old_exposure - new_exposure, new_exposure - old_exposure, data.c_username]
                                queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4)

                                transaction(queries, queryValues, (err, results) => {

                                    if (err)
                                        return callback(err);

                                    callback(null, 1);

                                });
                            }, timer * 1000);
                        })
                    })
                })
            })
        })
    },
    getFancyBook: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select user_rate,odds,selection,stake ' +
                'from bets ' +
                'where state="matched" and type="fancy" and event_id=? and runner_id=?';
        } else {

            const query2 = 'select usertype from users where username=?'
            const response = await pool.query(query2, [data.username])
            usertype = response[0].usertype

            switch (usertype) {

                case '2':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?))))';
                    break;
                case '3':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?)))';
                    break;
                case '4':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username in (select downlink from isclient where uplink=?))';
                    break;
                case '5':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username=?)';
                    break;
            }
        }

        pool.query(query1, [data.event, data.runner, data.username], (err, results, fields) => {
            if (err)
                callback(err);
            else {

                if (usertype !== '5') {

                    for (const bet of results) {
                        if (bet.selection === 'back') {
                            bet.selection = 'lay'
                        } else {
                            bet.selection = 'back'
                        }
                    }
                }

                let book = fancybook(results)
                callback(null, book)
            }
        });

    },
    runnerExposure: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select user_rate,odds,selection,stake ' +
                'from bets ' +
                'where state="matched" and type="fancy" and event_id=? and runner_id=?';
        } else {

            const query2 = 'select usertype from users where username=?'
            const response = await pool.query(query2, [data.username])
            usertype = response[0].usertype

            switch (usertype) {

                case '2':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username in (select downlink from isclient where uplink in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?))))';
                    break;
                case '3':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))';
                    break;
                case '4':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username in (select downlink from isclient where uplink=?))';
                    break;
                case '5':
                    query1 = 'select user_rate,odds,selection,stake ' +
                        'from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                        '(select bet_id from betmap where username=?)';
                    break;
            }
        }

        pool.query(query1, [data.event, data.runner, data.username], (err, results, fields) => {
            if (err)
                callback(err);
            else {

                if (usertype !== '5' && results.length) {

                    for (const bet of results) {
                        if (bet.selection === 'back') {
                            bet.selection = 'lay'
                        } else {
                            bet.selection = 'back'
                        }
                    }
                }
                let exposure = 0;
                if (results.length) {

                    let book = fancybook(results)

                    let netProfitArray = book.map(fancy => {
                        return fancy.net_profit
                    })
                    let min = Math.min.apply(Math, netProfitArray);

                    if (min < 0) {
                        exposure = -min;
                    }
                }
                callback(null, exposure, usertype)
            }
        });
    },
    sportList: (username, callback) => {

        let query

        if (username.toLowerCase() === 'admin') {
            query = 'select * from sports'
        } else {
            query = 'select A.status,B.event_type,C.name from limitsports as A,limitmap as B,sports as C where A.id=B.id and B.event_type=C.event_type and B.username=?'
        }

        pool.query(query, [username], (err, result, fields) => {
            if (err) {
                callback(err)
            } else {
                callback(null, result)
            }
        })

    },
    toggleSport: (data, callback) => {

        let query

        if (data.username.toLowerCase() === 'admin') {

            query = 'select  * from sports where event_type=?'
        } else {
            query = 'select A.last_up_by,B.status,C.usertype from limitmap as A,limitsports as B,users as C where A.id=B.id and A.username=C.username and A.event_type=? and A.username=?'
        }

        pool.query(query, [data.event_type, data.username], (err, result, fields) => {
            if (err) {
                callback(err)
            } else {

                const queries = [], queryValues = []
                if (result.length && data.username.toLowerCase() === 'admin') {

                    const query1 = 'update limitsports set status =? where id in(select id from limitmap where event_type=?)'
                    const query2 = 'update limitrisk set status =? where id in(select id from limitmap where event_type=?)'
                    const query3 = 'update limitfancyrisk set status =? where id in(select id from limitmap where event_type=?)'
                    const query4 = 'update limitmap set last_up_by =? where event_type=?'
                    const query5 = 'update sports set status=? where event_type=?'
                    queries.push(query1, query2, query3, query4, query5)

                    const queryValue1 = [result[0].status === 'on' ? 'off' : 'on', data.event_type]
                    const queryValue2 = [result[0].status === 'on' ? 'off' : 'on', data.event_type]
                    const queryValue3 = [result[0].status === 'on' ? 'off' : 'on', data.event_type]
                    const queryValue4 = [result[0].status === 'on' ? '1' : 'def', data.event_type]
                    const queryValue5 = [result[0].status === 'on' ? 'off' : 'on', data.event_type]
                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5)

                } else {

                    if (result[0].last_up_by !== 'def') {
                        callback(null, 0)
                        return
                    }

                    const query1 = 'update limitsports set status =? where id in(select id from limitmap where event_type=? and username=? or event_type=? and username in (select downlink from isclient where uplink=?) or event_type=? and username in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))'
                    const query2 = 'update limitrisk set status =? where id in(select id from limitmap where event_type=? and username=? or event_type=? and username in (select downlink from isclient where uplink=?) or event_type=? and username in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?)) or event_type=? and username in(select downlink from isclient where uplink in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?))))'
                    const query3 = 'update limitfancyrisk set status =? where id in(select id from limitmap where event_type=? and username=? or event_type=? and username in (select downlink from isclient where uplink=?) or event_type=? and username in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?)) or event_type=? and username in(select downlink from isclient where uplink in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?))))'

                    let query4
                    if (result[0].usertype === '2') {
                        query4 = 'update limitmap set last_up_by =? where event_type=? and username in(select downlink from isclient where uplink=?) or event_type=? and username in(select downlink from isclient where uplink in(select downlink from isclient where uplink=?))'
                    } else if (result[0].usertype === '3') {
                        query4 = 'update limitmap set last_up_by =? where event_type=? and username in (select downlink from isclient where uplink=?)'
                    }

                    if (result[0].usertype === '4') {
                        queries.push(query1, query2, query3)
                    } else {
                        queries.push(query1, query2, query3, query4)
                    }

                    const queryValue1 = [result[0].status === 'on' ? 'off' : 'on', data.event_type, data.username, data.event_type, data.username, data.event_type, data.username]
                    const queryValue2 = [result[0].status === 'on' ? 'off' : 'on', data.event_type, data.username, data.event_type, data.username, data.event_type, data.username, data.event_type, data.username]
                    const queryValue3 = [result[0].status === 'on' ? 'off' : 'on', data.event_type, data.username, data.event_type, data.username, data.event_type, data.username, data.event_type, data.username]
                    const queryValue4 = [result[0].status === 'on' ? result[0].usertype : 'def', data.event_type, data.username, data.event_type, data.username, data.event_type, data.username]

                    if (result[0].usertype === '4') {
                        queryValues.push(queryValue1, queryValue2, queryValue3)
                    } else {
                        queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4)
                    }

                }
                transaction(queries, queryValues, (err, result) => {

                    if (err)
                        callback(err);
                    else
                        callback(null, 1);
                });
            }
        })
    },
    getStakes: (username, callback) => {

        const query1 = 'select stake1,stake2,stake3,stake4,stake5,stake6 from stakevalue where username=?'
        pool.query(query1, [username], (error, result1, fields) => {
            if (error)
                callback(error);
            else {

                const query2 = 'select stake1,stake2,stake3,stake4,stake5,stake6 from stakelabel where username=?'
                pool.query(query2, [username], (error, result2, fields) => {
                    if (error)
                        callback(error);
                    else {
                        const allStakes = [];
                        let i = 1;

                        for (const key in result1[0]) {
                            allStakes.push({
                                key: i++,
                                label: result2[0][key],
                                stake: result1[0][key]
                            })
                        }
                        callback(null, allStakes)
                    }
                })
            }
        })
    },
    setStakes: (data, callback) => {

        const queries = [], queryValues = []

        const query1 = 'update stakevalue set stake1=?,stake2=?,stake3=?,stake4=?,stake5=?,stake6=? where username=?'
        const query2 = 'update stakelabel set stake1=?,stake2=?,stake3=?,stake4=?,stake5=?,stake6=? where username=?'

        const queryValue1 = [data.value1, data.value2, data.value3, data.value4, data.value5, data.value6, data.username]
        const queryValue2 = [data.label1, data.label2, data.label3, data.label4, data.label5, data.label6, data.username]

        queries.push(query1, query2)
        queryValues.push(queryValue1, queryValue2)

        transaction(queries, queryValues, (err, result) => {

            if (err) {
                callback(err)
            }
            else {
                callback(null, 1)
            }
        });
    },
    betHistory: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select A.bet_id,A.event,A.market,A.IP_Address,A.runner,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper ' +
                'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) ' +
                'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) ' +
                'order by A.settled_at desc'
        } else {

            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '2':
                    query1 = 'select A.bet_id,A.event,A.market,A.IP_Address,A.runner,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,A.IP_Address,B.username,C.uplink as master,D.uplink as supermaster ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and E.uplink=?) ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and E.uplink=?) ' +
                        'order by A.settled_at desc'
                    break;
                case '3':
                    query1 = 'select A.bet_id,A.event,A.market,A.IP_Address,A.runner,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,B.username,C.uplink as master,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and D.uplink=?) ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and D.uplink=?) ' +
                        'order by A.settled_at desc'
                    break;
                case '4':
                    query1 = 'select A.bet_id,A.event,A.market,A.IP_Address,A.runner,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,B.username,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and C.uplink=?) ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and C.uplink=?) ' +
                        'order by A.settled_at desc'
                    break;
                case '5':
                    query1 = 'select A.bet_id,A.event,A.market,A.IP_Address,A.runner,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,A.IP_Address ' +
                        'from bets as A,betmap as B ' +
                        'where (A.bet_id=B.bet_id and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and B.username=?) ' +
                        'or (A.bet_id=B.bet_id and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and B.username=?) ' +
                        'order by A.settled_at desc'
                    break;
            }
        }
        pool.query(query1, data.username.toLowerCase() === 'admin' ? [data.from, data.to, data.from, data.to] : [data.from, data.to, data.username, data.from, data.to, data.username], (err, result, fields) => {
            if (err) {
                callback(err)
            } else {
                callback(null, result)
            }
        })
    },
    profitLoss: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = "select * from(" +
                "select event_id,event,market,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,winner,sport " +
                "from bets " +
                "where type='exchange' and state!=?" + (data.sport === 'All' ? ' ' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') or type='bookmaker' and state!=?" + (data.sport === 'All' ? ' ' : " and sport=?") + "  and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                "group by event_id,event,market,type,settled_at,winner,sport " +
                "union all " +
                "select event_id,event,runner,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,pass,sport " +
                "from bets " +
                "where type='fancy' and state!=?" + (data.sport === 'All' ? ' ' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') " +
                "group by event_id,event,runner,type,settled_at,pass,sport) results " +
                "order by settled_at desc"

        } else {

            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '2':
                    query1 = "select * from(" +
                        "select event_id,event,market,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,winner,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))) and type='exchange' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') or type='bookmaker' and bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))) and state!=? " + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,market,type,settled_at,winner,sport " +
                        "union all " +
                        "select event_id,event,runner,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,pass,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink in(select downlink from isclient where uplink=?)))) and type='fancy' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,runner,type,settled_at,pass,sport) results " +
                        "order by settled_at desc"
                    break;
                case '3':
                    query1 = "select * from(" +
                        "select event_id,event,market,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,winner,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?))) and type='exchange' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') or type='bookmaker' and bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?))) and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,market,type,settled_at,winner,sport " +
                        "union all " +
                        "select event_id,event,runner,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,pass,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink in (select downlink from isclient where uplink=?))) and type='fancy' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,runner,type,settled_at,pass,sport) results " +
                        "order by settled_at desc"
                    break;
                case '4':
                    query1 = "select * from(" +
                        "select event_id,event,market,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,winner,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink=?)) and type='exchange' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') or type='bookmaker' and bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink=?)) and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,market,type,settled_at,winner,sport " +
                        "union all " +
                        "select event_id,event,runner,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,pass,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username in (select downlink from isclient where uplink=?)) and type='fancy' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,runner,type,settled_at,pass,sport) results " +
                        "order by settled_at desc"
                    break;
                case '5':
                    query1 = "select * from(" +
                        "select event_id,event,market,type,sum(Profit_Loss_wc) as Profit_Loss,settled_at,winner,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username=?) and type='exchange' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') or type='bookmaker' and bet_id in(select bet_id from betmap where username=?) and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + "  and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,market,type,settled_at,winner,sport " +
                        "union all " +
                        "select event_id,event,runner,type,sum(Profit_Loss_wc) as Profit_Loss,settled_at,pass,sport " +
                        "from bets " +
                        "where bet_id in(select bet_id from betmap where username=?) and type='fancy' and state!=?" + (data.sport === 'All' ? '' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
                        "group by event_id,event,runner,type,settled_at,pass,sport) results " +
                        "order by settled_at desc"
                    break;
            }
        }
        let queryValue

        if (data.sport === 'All') {
            if (data.username.toLowerCase() === 'admin') {
                queryValue = ["matched", data.from, data.to, "matched", data.from, data.to, "matched", data.from, data.to]

            } else {
                queryValue = [data.username, "matched", data.from, data.to, data.username, "matched", data.from, data.to, data.username, "matched", data.from, data.to]
            }
        } else {
            if (data.username.toLowerCase() === 'admin') {
                queryValue = ["matched", data.sport, data.from, data.to, "matched", data.sport, data.from, data.to, "matched", data.sport, data.from, data.to]
            } else {
                queryValue = [data.username, "matched", data.sport, data.from, data.to, data.username, "matched", data.sport, data.from, data.to, data.username, "matched", data.sport, data.from, data.to]
            }
        }

        pool.query(query1, queryValue, (err, result, fields) => {
            if (err)
                callback(err);
            else {

                let total = 0

                for (const market of result) {
                    total = total + market.Profit_Loss
                }

                callback(null, result, total);
            }
        });
    },
    showMarketReport: async (data, callback) => {
        let query1, query2, res1, res2

        try {
            if (data.username.toLowerCase() === 'admin') {

                query1 = 'select A.uplink as username,-sum(E.profit_loss_wc) as loss from isclient as A,isclient as B,isclient as C,betmap as D,bets as E where A.downlink=B.uplink and B.downlink=C.uplink and C.downlink=D.username and D.bet_id=E.bet_id and E.event_id=? and E.event=? and E.market=? and E.profit_loss_wc<=0 group by A.uplink'
                res1 = await pool.query(query1, [data.event_id, data.event, data.market])

                query2 = 'select A.uplink as username,-sum(E.profit_loss_wc) as gain from isclient as A,isclient as B,isclient as C,betmap as D,bets as E where A.downlink=B.uplink and B.downlink=C.uplink and C.downlink=D.username and D.bet_id=E.bet_id and E.event_id=? and E.event=? and E.market=? and E.profit_loss_wc>=0 group by A.uplink'
                res2 = await pool.query(query2, [data.event_id, data.event, data.market])

            } else {

                const query3 = 'select usertype from users where username=?'
                const response = await pool.query(query3, [data.username])
                usertype = response[0].usertype

                switch (usertype) {

                    case '2':
                        query1 = 'select A.uplink as username,-sum(D.profit_loss_wc) as loss from isclient as A,isclient as B,betmap as C,bets as D where A.downlink=B.uplink and B.downlink=C.username and C.bet_id=D.bet_id and D.event_id=? and D.event=? and D.market=? and D.profit_loss_wc<=0 and A.uplink in(select downlink from isclient where uplink=?) group by A.uplink'
                        res1 = await pool.query(query1, [data.event_id, data.event, data.market, data.username])

                        query2 = 'select A.uplink as username,-sum(D.profit_loss_wc) as gain from isclient as A,isclient as B,betmap as C,bets as D where A.downlink=B.uplink and B.downlink=C.username and C.bet_id=D.bet_id and D.event_id=? and D.event=? and D.market=? and D.profit_loss_wc>=0 and A.uplink in(select downlink from isclient where uplink=?) group by A.uplink'
                        res2 = await pool.query(query2, [data.event_id, data.event, data.market, data.username])
                        break;
                    case '3':
                        query1 = 'select A.uplink as username,-sum(C.profit_loss_wc) as loss from isclient as A,betmap as B,bets as C where A.downlink=B.username and B.bet_id=C.bet_id and C.event_id=? and C.event=? and C.market=? and C.profit_loss_wc<=0 and A.uplink in(select downlink from isclient where uplink=?) group by A.uplink'
                        res1 = await pool.query(query1, [data.event_id, data.event, data.market, data.username])

                        query2 = 'select A.uplink as username,-sum(C.profit_loss_wc) as gain from isclient as A,betmap as B,bets as C where A.downlink=B.username and B.bet_id=C.bet_id and C.event_id=? and C.event=? and C.market=? and C.profit_loss_wc>=0 and A.uplink in(select downlink from isclient where uplink=?) group by A.uplink'
                        res2 = await pool.query(query2, [data.event_id, data.event, data.market, data.username])
                        break;
                    case '4':
                        query1 = 'select A.username,sum(B.profit_loss_wc) as loss from betmap as A,bets as B where A.bet_id=B.bet_id and B.event_id=? and B.event=? and B.market=? and B.profit_loss_wc<=0 and A.username in(select downlink from isclient where uplink=?) group by A.username'
                        res1 = await pool.query(query1, [data.event_id, data.event, data.market, data.username])

                        query2 = 'select A.username,sum(B.profit_loss_wc) as gain from betmap as A,bets as B where A.bet_id=B.bet_id and B.event_id=? and B.event=? and B.market=? and B.profit_loss_wc>=0 and A.username in(select downlink from isclient where uplink=?) group by A.username'
                        res2 = await pool.query(query2, [data.event_id, data.event, data.market, data.username])
                        break;
                    case '5':
                        query1 = 'select A.username,sum(B.profit_loss_wc) as loss from betmap as A,bets as B where A.bet_id=B.bet_id and B.event_id=? and B.event=? and B.market=? and B.profit_loss_wc<=0 and A.username=?'
                        res1 = await pool.query(query1, [data.event_id, data.event, data.market, data.username])

                        query2 = 'select A.username,sum(B.profit_loss_wc) as gain from betmap as A,bets as B where A.bet_id=B.bet_id and B.event_id=? and B.event=? and B.market=? and B.profit_loss_wc>=0 and A.username=?'
                        res2 = await pool.query(query2, [data.event_id, data.event, data.market, data.username])
                        break;
                }
            }

            res1 = res1.filter(user => user.username != null)
            res2 = res2.filter(user => user.username != null)

            if (res1.length) {

                res1.map(user1 => {

                    const user = res2.find(user2 => user2.username === user1.username)
                    if (user) {
                        res2 = res2.filter(user2 => user2.username !== user1.username)
                        user1.gain = user.gain
                    } else {
                        user1.gain = 0
                    }
                })

            }

            if (res2.length) {

                res2.map(user2 => {
                    user2.loss = 0
                    res1.push(user2)
                })
            }

            return callback(null, res1)

        } catch (err) {
            return callback(err)
        }
    },
    showBetHistory: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select A.bet_id,A.event,A.market,A.runner,A.IP_Address,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper ' +
                'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and market=? and A.event_id=? ' +
                'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and market=? and A.event_id=? ' +
                'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and runner=? and A.event_id=? ' +
                'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and runner=? and A.event_id=? ' +
                'order by A.settled_at desc'
        } else {

            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '2':
                    query1 = 'select A.bet_id,A.event,A.market,A.runner,A.IP_Address,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,A.IP_Address,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and E.uplink=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and E.uplink=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and E.uplink=?) and event=? and runner=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and E.uplink=?) and event=? and runner=? and A.event_id=? ' +
                        'order by A.settled_at desc'
                    break;
                case '3':
                    query1 = 'select A.bet_id,A.event,A.market,A.runner,A.IP_Address,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and D.uplink=?) and event=? and market=? and A.event_id=?' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and D.uplink=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and D.uplink=?) and event=? and runner=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and D.uplink=?) and event=? and runner=? and A.event_id=? ' +
                        'order by A.settled_at desc'
                    break;
                case '4':
                    query1 = 'select A.bet_id,A.event,A.market,A.runner,A.IP_Address,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper,A.IP_Address ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and C.uplink=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and C.uplink=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and C.uplink=?) and event=? and runner=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and C.uplink=?) and event=? and runner=? and A.event_id=? ' +
                        'order by A.settled_at desc'
                    break;
                case '5':
                    query1 = 'select A.bet_id,A.event,A.market,A.runner,A.IP_Address,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss,A.placed_at,A.settled_at,A.IP_Address,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper ' +
                        'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
                        'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and B.username=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and B.username=?) and event=? and market=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and B.username=?) and event=? and runner=? and A.event_id=? ' +
                        'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and B.username=?) and event=? and runner=? and A.event_id=? ' +
                        'order by A.settled_at desc'
                    break;
            }
        }
        pool.query(query1, data.username.toLowerCase() === 'admin' ? [data.from, data.to, data.event, data.market, data.eventId, data.from, data.to, data.event, data.market, data.eventId, data.from, data.to, data.event, data.market, data.eventId, data.from, data.to, data.event, data.market, data.eventId] : [data.from, data.to, data.username, data.event, data.market, data.eventId, data.from, data.to, data.username, data.event, data.market, data.eventId, data.from, data.to, data.username, data.event, data.market, data.eventId, data.from, data.to, data.username, data.event, data.market, data.eventId], (err, result, fields) => {
            if (err) {
                callback(err)
            } else {
                callback(null, result)
            }
        })
    },
    clientPL: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select sum(A.Profit_Loss) as Profit_Loss,E.uplink as username from bets as A,betmap as B,isclient as C,isclient as D,isclient as E where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink group by E.uplink'

        } else {

            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '2':
                    query1 = 'select sum(A.Profit_Loss) as Profit_Loss,E.downlink as username from bets as A,betmap as B,isclient as C,isclient as D,isclient as E where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and E.uplink=? group by E.downlink'
                    break
                case '3':
                    query1 = 'select sum(A.Profit_Loss) as Profit_Loss,D.downlink as username from bets as A,betmap as B,isclient as C,isclient as D where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=? group by D.downlink'
                    break
                case '4':
                    query1 = 'select sum(A.Profit_Loss) as Profit_Loss,sum(A.Profit_Loss_wc) as Profit_Loss_wc,C.downlink as username from bets as A,betmap as B,isclient as C where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=? group by C.downlink'
                    break
                default:
                    break;
            }
        }
        pool.query(query1, [data.from, data.to, data.username], (error, results, fields) => {
            if (error)
                callback(error);
            else {

                if (data.username.toLowerCase() === 'admin') {
                    usertype = '1'
                }

                const { left, right } = applyCommission(results, usertype)
                callback(null, results, left, right);
            }
        })
    },
    fancyStakes: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select sum(A.stake) as amount,E.uplink as username from bets as A,betmap as B,isclient as C,isclient as D,isclient as E where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and A.type=? and A.state!="void" and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink group by E.uplink'

        } else {

            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '2':
                    query1 = 'select sum(A.stake) as amount,E.downlink as username from bets as A,betmap as B,isclient as C,isclient as D,isclient as E where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and type=? and A.state!="void" and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and E.uplink=? group by E.downlink'
                    break
                case '3':
                    query1 = 'select sum(A.stake) as amount,D.downlink as username from bets as A,betmap as B,isclient as C,isclient as D where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and type=? and A.state!="void" and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=? group by D.downlink'
                    break
                case '4':
                    query1 = 'select sum(A.stake) as amount,C.downlink as username from bets as A,betmap as B,isclient as C where A.settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") and type=? and A.state!="void" and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=? group by C.downlink'
                    break
                default:
                    break;
            }
        }
        pool.query(query1, [data.from, data.to, 'fancy', data.username], (error, results, fields) => {
            if (error)
                callback(error);
            else {

                let total = 0
                for (const user of results) {
                    total = total + user.amount
                }
                callback(null, results, total);
            }
        })
    },
    chipSummary: async (data, callback) => {

        let query1, usertype, uplink

        if (data.username.toLowerCase() === 'admin') {

            query1 = 'select username,usertype,winnings from users where usertype="2"'

        } else {

            try {
                const query2 = 'select A.usertype,B.uplink from users as A,isclient as B where A.username=? and A.username=B.downlink'
                const response = await pool.query(query2, [data.username])

                if (response.length) {
                    usertype = response[0].usertype
                    uplink = response[0].uplink
                } else {
                    usertype = '2'
                    uplink = 'admin'
                }
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '4':
                    query1 = 'select username,usertype,winnings from users where username =? or username in (select downlink from isclient where uplink=?)'
                    break
                default:
                    query1 = 'select username,usertype,-winnings as winnings from users where username =? or username in (select downlink from isclient where uplink=?)'
                    break
            }
        }

        pool.query(query1, [data.username, data.username], (error, results, fields) => {
            if (error)
                callback(error);
            else {
                if (usertype !== '5') {
                    const index = results.findIndex(user => user.usertype === usertype)
                    if (index != -1) {
                        results[index].username = uplink
                        results[index].winnings = -results[index].winnings
                    }
                }
                callback(null, results);
            }
        })
    },
    settlement: async (data, callback) => {

        let query1, query2
        const queries = [], queryValues = []

        if (data.uplink.toLowerCase() === 'admin') {

            let balance, winnings

            try {

                const query = 'select balance,winnings,usertype from users where username=?'
                const response = await pool.query(query, [data.downlink])
                balance = response[0].balance
                winnings = response[0].winnings

                if (!winnings) {
                    callback(null, 1)
                    return
                }

            } catch (err) {
                callback(err);
            }

            if (winnings > 0) {

                if (winnings > balance) {

                    callback(null, 0)
                } else {

                    query1 = 'update admin set coins_generated=coins_generated+? where username=?'
                    query2 = 'update users set balance=balance+?,credit_limit=credit_limit+?,winnings=0 where username=?'
                }

            } else {
                query1 = 'update admin set coins_withdrawn=coins_withdrawn-? where username=?'
                query2 = 'update users set balance=balance+?,credit_limit=credit_limit+?,winnings=0 where username=?'
            }

            const query3 = "select @coins_generated:=coins_generated,@coins_withdrawn:=coins_withdrawn from admin where username=?"
            const query4 = 'insert into adsetransactions(deposited,withdrawn,description,balance,type,created_at) values(?,?,?,IF(?>0,@coins_generated,@coins_withdrawn),?,?)'
            const query5 = "select @balance:=balance from users where username=?"
            const query6 = 'insert into transactionmap(username) values(?)';
            const query7 = 'SET @trans_id = LAST_INSERT_ID()';
            const query8 = 'insert into alltransactions(transaction_id,deposited,withdrawn,description,balance,type,created_at) values(@trans_id,?,?,?,@balance,?,?)'

            queries.push(query1, query2, query3, query4, query5, query6, query7, query8)

            const queryValue1 = [winnings, data.uplink]
            const queryValue2 = [winnings, winnings, data.downlink]
            const queryValue3 = [data.uplink]
            const queryValue4 = [winnings > 0 ? winnings : null, winnings < 0 ? -winnings : null, (winnings < 0 ? data.uplink + ' gave cash to ' + data.downlink : data.uplink + ' received cash from ' + data.downlink), winnings, 'se', new Date()]
            const queryValue5 = [data.downlink]
            const queryValue6 = [data.downlink]
            const queryValue7 = []
            const queryValue8 = [winnings > 0 ? winnings : null, winnings < 0 ? -winnings : null, (winnings > 0 ? data.downlink + ' gave cash to ' + data.uplink : data.downlink + ' received cash from ' + data.uplink), 'se', new Date()];

            queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8);

        } else {

            let up_usertype, up_balance, down_usertype, down_balance, winnings, queryValue7, queryValue10

            try {
                const query = 'select usertype,balance,winnings,username from users where username=? or username=?'
                const response = await pool.query(query, [data.downlink, data.uplink])

                down_usertype = response.filter(user => user.username.toLowerCase() === data.downlink.toLowerCase())[0].usertype
                down_balance = response.filter(user => user.username.toLowerCase() === data.downlink.toLowerCase())[0].balance
                winnings = response.filter(user => user.username.toLowerCase() === data.downlink.toLowerCase())[0].winnings

                up_usertype = response.filter(user => user.username.toLowerCase() === data.uplink.toLowerCase())[0].usertype
                up_balance = response.filter(user => user.username.toLowerCase() === data.uplink.toLowerCase())[0].balance

                if (!winnings) {
                    callback(null, 1)
                    return
                }

                if (parseFloat(up_usertype) - parseFloat(down_usertype) !== -1) {
                    callback(null, 1)
                }
            } catch (err) {
                callback(err)
            }

            switch (down_usertype) {

                case '5':
                    if (winnings > 0 && down_balance < winnings) {
                        callback(null, 0)
                    } else if (winnings < 0 && up_balance < winnings) {
                        callback(null, 0)
                    } else {
                        query1 = 'update users set balance=balance-?,credit_limit=credit_limit+?,winnings=0 where username=?'
                        query2 = 'update users set balance=balance+?,exposure=exposure-? where username=?'
                    }
                    queryValue7 = [winnings < 0 ? -winnings : null, winnings > 0 ? winnings : null, winnings < 0 ? data.downlink + ' gave cash to ' + data.uplink : data.downlink + ' received cash from' + data.uplink, 'se', new Date()]
                    queryValue10 = [winnings > 0 ? winnings : null, winnings < 0 ? -winnings : null, winnings > 0 ? data.uplink + ' gave cash to ' + data.downlink : data.uplink + ' received cash from' + data.downlink, 'se', new Date()]

                    break;
                default:

                    if (winnings > 0 && up_balance < winnings) {
                        callback(null, 0)
                    } else if (winnings < 0 && down_balance < winnings) {
                        callback(null, 0)
                    } else {
                        query1 = 'update users set balance=balance+?,credit_limit=credit_limit+?,winnings=0 where username=?'
                        query2 = 'update users set balance=balance-?,exposure=exposure+? where username=?'
                    }
                    queryValue7 = [winnings > 0 ? winnings : null, winnings < 0 ? -winnings : null, winnings > 0 ? data.downlink + ' gave cash to ' + data.uplink : data.downlink + ' received cash from' + data.uplink, 'se', new Date()]
                    queryValue10 = [winnings < 0 ? -winnings : null, winnings > 0 ? winnings : null, winnings < 0 ? data.uplink + ' gave cash to ' + data.downlink : data.uplink + ' received cash from' + data.downlink, 'se', new Date()]

                    break;
            }

            const query3 = "select @down_balance:=balance from users where username=?"
            const query4 = "select @up_balance:=balance from users where username=?"
            const query5 = 'insert into transactionmap(username) values(?)';
            const query6 = 'SET @trans_id = LAST_INSERT_ID()';
            const query7 = 'insert into alltransactions(transaction_id,deposited,withdrawn,description,balance,type,created_at) values(@trans_id,?,?,?,@down_balance,?,?)';
            const query8 = 'insert into transactionmap(username) values(?)';
            const query9 = 'SET @trans_id = LAST_INSERT_ID()';
            const query10 = 'insert into alltransactions(transaction_id,deposited,withdrawn,description,balance,type,created_at) values(@trans_id,?,?,?,@up_balance,?,?)';

            queries.push(query1, query2, query3, query4, query5, query6, query7, query8, query9, query10)

            const queryValue1 = [winnings, winnings, data.downlink]
            const queryValue2 = [winnings, winnings, data.uplink]
            const queryValue3 = [data.downlink]
            const queryValue4 = [data.uplink];
            const queryValue5 = [data.downlink];
            const queryValue6 = [];
            const queryValue8 = [data.uplink];
            const queryValue9 = [];

            queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10);

        }
        transaction(queries, queryValues, (err, result) => {

            if (err)
                callback(err);
            else
                callback(null, 2);
        });
    },
    setCommission: (data, callback) => {

        if (data.Commission >= 0.5) {
            callback(null, 'Invalid commission value', false)
            return
        }

        const query = 'update users set commission=?where username=?'
        pool.query(query, [data.Commission, data.username], (err, results, fields) => {

            if (err) {
                callback(err)
            } else {
                callback(null, 'Commission updated successfully', true)
            }

        })
    },
    isSuspended: (username, callback) => {

        if (username.toLowerCase() === 'admin') {
            callback(null, 0)
            return
        }

        const query = 'select suspended from users where username=?'
        pool.query(query, [username], (err, result) => {

            if (err) {
                callback(err)
            }
            else {
                callback(null, result[0].suspended)
            }
        })
    },
    isBetSuspended: (username, callback) => {

        if (username.toLowerCase() === 'admin') {
            callback(null, 0)
            return
        }

        const query = 'select bet_suspended,suspended from users where username=?'
        pool.query(query, [username], (err, result) => {
            if (err) {
                callback(err)
            }
            else {
                callback(null, result[0].bet_suspended + result[0].suspended)
            }
        })
    },
    toggleSuspend: (username, callback) => {

        const query1 = "select suspended from users where username=?"
        pool.query(query1, [username], async (err, results) => {
            if (err)
                callback(err);
            else {

                const queries = [], queryValues = []
                let usertype

                try {
                    const query2 = 'select usertype from users where username=?'
                    const response = await pool.query(query2, [username])
                    usertype = response[0].usertype
                } catch (err) {
                    callback(err)
                }

                switch (usertype) {

                    case '2':

                        {
                            const query3 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username=?"
                            const query4 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink=?)"
                            const query5 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink=?))"
                            const query6 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink=?)))"

                            queries.push(query3, query4, query5, query6)
                            queryValues.push([username], [username], [username], [username])
                        }
                        break;
                    case '3':

                        {
                            const query3 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username=?"
                            const query4 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink=?)"
                            const query5 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink=?))"

                            queries.push(query3, query4, query5)
                            queryValues.push([username], [username], [username])
                        }
                        break;
                    case '4':

                        {
                            const query3 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username=?"
                            const query4 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink=?)"

                            queries.push(query3, query4)
                            queryValues.push([username], [username])
                        }
                        break;
                    case '5':

                        const query3 = "update users set suspended=" + (results[0].suspended === 0 ? '1' : '0') + " where username=?"

                        queries.push(query3)
                        queryValues.push([username])
                        break;
                }



                transaction(queries, queryValues, (err, result) => {

                    if (err)
                        callback(err);
                    else
                        callback(null, results[0].suspended);
                });
            }
        });
    },
    toggleBetSuspend: (username, callback) => {

        const query1 = "select bet_suspended from users where username=?"
        pool.query(query1, [username], async (err, result) => {
            if (err)
                callback(err);
            else {

                const queries = [], queryValues = []
                let usertype

                try {
                    const query2 = 'select usertype from users where username=?'
                    const response = await pool.query(query2, [username])
                    usertype = response[0].usertype
                } catch (err) {
                    callback(err)
                }

                switch (usertype) {

                    case '2':

                        {
                            const query3 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username=?"
                            const query4 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink=?)"
                            const query5 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink=?))"
                            const query6 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink=?)))"

                            queries.push(query3, query4, query5, query6)
                            queryValues.push([username], [username], [username], [username])
                        }
                        break;
                    case '3':

                        {
                            const query3 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username=?"
                            const query4 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink=?)"
                            const query5 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink in " +
                                "(select downlink from isclient where uplink=?))"

                            queries.push(query3, query4, query5)
                            queryValues.push([username], [username], [username])
                        }
                        break;
                    case '4':

                        {
                            const query3 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username=?"
                            const query4 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username In " +
                                "(select downlink from isclient where uplink=?)"

                            queries.push(query3, query4)
                            queryValues.push([username], [username])
                        }
                        break;
                    case '5':

                        const query3 = "update users set bet_suspended=" + (result[0].bet_suspended === 0 ? '1' : '0') + " where username=?"

                        queries.push(query3)
                        queryValues.push([username])
                        break;
                }

                transaction(queries, queryValues, (err, results) => {

                    if (err)
                        callback(err);
                    else
                        callback(null, result[0].bet_suspended);
                });
            }
        });
    },
    getExposure: (username, callback) => {

        const query = "select A.event,A.market,D.event_exposure as exposure,A.sport " +
            "from bets as A,betmap as B,clientbookmap as C,eventexposure as D " +
            "where B.username=? and A.bet_id=B.bet_id and A.state='matched' and B.username=C.username and A.event_id=C.event and A.market_id=C.market and C.id=D.id " +
            "group by A.event,A.market,D.event_exposure,A.sport "

        pool.query(query, [username], (err, result1, fields) => {
            if (err)
                callback(err);
            else {

                const query1 = 'select event,event_id,runner_id,runner as market,sport from bets where state="matched" and type="fancy" and bet_id in(select bet_id from betmap where username=?) group by event,event_id,runner_id,runner,sport'
                pool.query(query1, [username], async (err, result2, fields) => {
                    if (err)
                        callback(err);
                    else {

                        for (const fancy of result2) {

                            const query = 'select user_rate,odds,selection,stake ' +
                                'from bets ' +
                                'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                                '(select bet_id from betmap where username=?) ' +
                                'order by user_rate asc';

                            try {
                                const result3 = await pool.query(query, [fancy.event_id, fancy.runner_id, username])

                                let exposure = 0;
                                if (result3.length) {

                                    let book = fancybook(result3)

                                    let netProfitArray = book.map(fancy => {
                                        return fancy.net_profit
                                    })
                                    let min = Math.min.apply(Math, netProfitArray);

                                    if (min < 0) {
                                        exposure = -min;
                                    }
                                }

                                fancy.exposure = exposure

                            } catch (err) {
                                callback(err)
                            }
                        }

                        callback(null, result1.concat(result2));
                    }
                })
            }
        });
    },
    exposureBets: (data, callback) => {

        const query = 'select B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.sport,A.type,A.IP_Address ' +
            'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
            'where A.bet_id=B.bet_id and B.username=? and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and A.state="matched" ' +
            'order by A.placed_at desc'

        pool.query(query, [data.username], (error, result, fields) => {
            if (error)
                callback(error);
            else {
                callback(null, result);
            }
        })
    },
    userPL: async (data, callback) => {

        let query1, usertype

        if (data.username.toLowerCase() === 'admin') {

            query1 = "select * from(select sum(A.Profit_Loss_wc) as Profit_Loss,A.sport,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                "where A.state=? and A.type!='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink " +
                "group by A.sport,B.username,C.uplink,D.uplink,E.uplink " +
                "union " +
                "select sum(A.Profit_Loss_wc) as Profit_Loss,A.type,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                "where A.state=? and A.type='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink " +
                "group by A.type,B.username,C.uplink,D.uplink,E.uplink) as results"

        } else {

            try {
                const query2 = 'select usertype from users where username=?'
                const response = await pool.query(query2, [data.username])
                usertype = response[0].usertype
            } catch (err) {
                callback(err)
            }

            switch (usertype) {

                case '2':
                    query1 = "select * from(select sum(A.Profit_Loss_wc) as Profit_Loss,A.sport,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                        "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                        "where A.state=? and A.type!='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and E.uplink=? " +
                        "group by A.sport,B.username,C.uplink,D.uplink,E.uplink " +
                        "union " +
                        "select sum(A.Profit_Loss_wc) as Profit_Loss,A.type,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                        "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                        "where A.state=? and A.type='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and E.uplink=? " +
                        "group by A.type,B.username,C.uplink,D.uplink,E.uplink) as results"
                    break;

                case '3':
                    query1 = "select * from(select sum(A.Profit_Loss_wc) as Profit_Loss,A.sport,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                        "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                        "where A.state=? and A.type!='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=? and D.uplink=E.downlink " +
                        "group by A.sport,B.username,C.uplink,D.uplink,E.uplink " +
                        "union " +
                        "select sum(A.Profit_Loss_wc) as Profit_Loss,A.type,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                        "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                        "where A.state=? and A.type='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=? and D.uplink=E.downlink " +
                        "group by A.type,B.username,C.uplink,D.uplink,E.uplink) as results"
                    break;
                case '4':
                    query1 = "select * from(select sum(A.Profit_Loss_wc) as Profit_Loss,A.sport,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                        "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                        "where A.state=? and A.type!='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and C.uplink=? and D.uplink=E.downlink " +
                        "group by A.sport,B.username,C.uplink,D.uplink,E.uplink " +
                        "union " +
                        "select sum(A.Profit_Loss_wc) as Profit_Loss,A.type,B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper " +
                        "from bets as A,betmap as B,isclient as C,isclient as D,isclient as E " +
                        "where A.state=? and A.type='fancy' and A.settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') and A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and C.uplink=? and D.uplink=E.downlink " +
                        "group by A.type,B.username,C.uplink,D.uplink,E.uplink) as results"
                    break;
            }
        }

        pool.query(query1, data.username.toLowerCase() === 'admin' ? ["settled", data.from, data.to, "settled", data.from, data.to] : ["settled", data.from, data.to, data.username, "settled", data.from, data.to, data.username], (err, result, fields) => {
            if (err)
                callback(err);
            else {

                let newResults = []

                for (const iterator of result) {

                    const index = newResults.findIndex(obj => obj.client === iterator.client)
                    if (index === -1) {

                        const obj = {
                            client: iterator.client,
                            master: iterator.master,
                            seniorsuper: iterator.seniorsuper,
                            supermaster: iterator.supermaster,
                            Cricket: 0,
                            Soccer: 0,
                            Tennis: 0,
                            fancy: 0
                        }

                        obj[iterator.sport] = iterator.Profit_Loss
                        newResults.push(obj)

                    } else {
                        newResults[index][iterator.sport] = iterator.Profit_Loss
                    }

                }

                callback(null, newResults);
            }
        });
    },
    getMessage: (callback) => {

        client.get('message', (err, message) => {

            if (err)
                return callback(err)

            if (message)
                return callback(null, message)

            const query = 'select message from superadmin'
            pool.query(query, (error, results, fields) => {
                if (error)
                    return callback(error);

                client.set('message', results.length ? results[0].message : '', (err, reply) => {
                    if (err)
                        return callback(err);

                    callback(null, results.length ? results[0].message : '');
                })
            })
        })

    },
    acceptAnyOdds: (username, callback) => {

        const query = "select any_odds from users where username=?"
        pool.query(query, [username], (err, result) => {

            if (err) {
                callback(err)
            }
            else {
                callback(null, result)
            }
        })

    },
    toggleAcceptAnyOdds: (username, callback) => {

        const query = "update users set any_odds=IF(any_odds='0','1','0') where username=?"
        pool.query(query, [username], (err, result) => {

            if (err) {
                callback(err)
            }
            else {
                callback(null, 'Status updated successfully')
            }
        })

    },
    loginSuccess: (data, callback) => {

        if (data.username.toLowerCase() === 'admin') {
            callback(null, 'ok')
            return
        }

        const queries = [], queryValues = [];
        let query1, query2, queryValue1, queryValue2

        query1 = 'insert into activity(username,IP_Address,action,status,name,region,city,country,time) values(?,?,?,?,?,?,?,?,?)'
        query2 = 'update users set token=? where username=?'

        queryValue1 = [data.username, data.IP_Address, 'login', 'success', data.name, data.region, data.city, data.country, data.time]
        queryValue2 = [data.token, data.username]

        queries.push(query1, query2)
        queryValues.push(queryValue1, queryValue2)

        transaction(queries, queryValues, (err, result) => {

            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    loginFailure: (data, callback) => {

        if (data.username.toLowerCase() === 'admin') {
            callback(null, 'ok')
            return
        }

        const query = 'insert into activity(username,IP_Address,action,status,name,region,city,country,time) values(?,?,?,?,?,?,?,?,?)'
        pool.query(query, [data.username, data.IP_Address, 'login', 'failure', data.name, data.region, data.city, data.country, data.time], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                callback(null, result);
            }
        });
    },
    // logoutSuccess: (username, IP_Address, callback) => {

    //     if (username.toLowerCase() === 'admin') {
    //         callback(null, 'ok')
    //         return
    //     }

    //     axios.get('https://geo.ipify.org/api/v1?apiKey=' + process.env.API_KEY + '&ipAddress=' + IP_Address)
    //         .then(response => {

    //             const queries = [], queryValues = []

    //             const query1 = 'insert into activity(username,IP_Address,action,status,name,region,city,country,vpn) values(?,?,?,?,?,?,?,?,?)'
    //             const query2 = 'update users set token=null where username=?'

    //             const queryValue1 = [username, IP_Address, 'logout', 'success', response.data.as ? response.data.as.name : null, response.data.location.region, response.data.location.city, response.data.location.country, response.data.proxy.vpn ? 'true' : 'false']
    //             const queryValue2 = [username]

    //             queries.push(query1, query2)
    //             queryValues.push(queryValue1, queryValue2)

    //             transaction(queries, queryValues, (err, result) => {

    //                 if (err)
    //                     callback(err);
    //                 else
    //                     callback(null, result);
    //             });
    //         })
    //         .catch(err => {
    //             callback(err);
    //         })
    // },
    // logoutFailure: (username, IP_Address, callback) => {

    //     if (username.toLowerCase() === 'admin') {
    //         callback(null, 'ok')
    //         return
    //     }

    //     axios.get('https://geo.ipify.org/api/v1?apiKey=' + process.env.API_KEY + '&ipAddress=' + IP_Address)
    //         .then(response => {

    //             const query = 'insert into activity(username,IP_Address,action,status,name,region,city,country,vpn) values(?,?,?,?,?,?,?,?,?)'
    //             pool.query(query, [username, IP_Address, 'logout', 'failure', response.data.as ? response.data.as.name : null, response.data.location.region, response.data.location.city, response.data.location.country, response.data.proxy.vpn ? 'true' : 'false'], (err, result, fields) => {
    //                 if (err)
    //                     callback(err);
    //                 else {
    //                     callback(null, result);
    //                 }
    //             });
    //         })
    //         .catch(err => {
    //             callback(err);
    //         })
    // },
    activity: (data, callback) => {

        const query = 'select * from activity where username=? and time between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30") order by time desc'
        pool.query(query, [data.username, data.from, data.to], (err, result, fields) => {
            if (err)
                return callback(err)

            callback(null, result)
        })
    },
    changeFullname: (data, callback) => {

        const query = 'update users set fullname=? where username=?'
        pool.query(query, [data.name, data.username], (err, result, fields) => {
            if (err)
                return callback(err)

            callback(null, 'Fullname changed successfully')
        })
    }
}