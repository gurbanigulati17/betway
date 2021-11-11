const pool = require('../../config/database');
const { transaction } = require('../../transaction_handler/transaction');
const axios = require('../../axios-instance/oddsApi');
const Promise = require('bluebird');
const { createClientBook, createClientBookWithOutRegister, fancybook, removeDups } = require('../../config/helpers');
const client = require('../../config/redisCon');

module.exports = {

    createAdmin: (data, callback) => {

        const query1 = 'select password from admin where username=?'
        pool.query(query1, ['admin'], (error, results, fields) => {
            if (error)
                callback(error);
            else {
                query2 = `insert into admin (password) values(?)`;

                if (results.length) {
                    callback(null, 'Admin already created')
                    return
                }

                pool.query(query2, [data.password], (error, results, fields) => {
                    if (error)
                        callback(error);
                    else {
                        callback(null, 'Admin created successfully');
                    }

                });
            }

        });
    },
    createSuperadmin: (data, callback) => {

        const query1 = 'select * from superadmin'
        pool.query(query1, [], (error, results, fields) => {
            if (error)
                callback(error);
            else {

                let query2
                if (!results.length) {
                    query2 = `insert into superadmin (password) values(?)`;
                }
                else {
                    callback(null, 'Superadmin already created')
                    return
                }

                pool.query(query2, [data.password], (error, results, fields) => {
                    if (error)
                        callback(error);
                    else {

                        const queries = [], queryValues = []

                        const array = []
                        array.push({ id: '1', name: 'Soccer', status: 'on' })
                        array.push({ id: '2', name: 'Tennis', status: 'on' })
                        array.push({ id: '4', name: 'Cricket', status: 'on' })
                        array.push({ id: '5', name: 'Fancy', status: 'on' })

                        array.forEach(sport => {
                            queries.push('insert into sports values(?,?,?)')
                            queryValues.push([sport.id, sport.name, sport.status])
                        })

                        transaction(queries, queryValues, (err, result) => {

                            if (err) {
                                callback(err);
                            }
                            else {
                                const query3 = 'select password from superadmin'
                                pool.query(query3, [data.password], (error, results, fields) => {
                                    if (error)
                                        callback(error);
                                    else {
                                        callback(null, results)
                                    }
                                })
                            }
                        });
                    }

                });
            }

        });
    },
    findPassword: (callback) => {

        const query = 'select password from superadmin where username=?';
        pool.query(query, ['superadmin'], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    changePassword: (password, callback) => {

        const query = "update superadmin set password=? where username=?"
        pool.query(query, [password, "superadmin"], (err, result, fields) => {

            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    existingSeries: (sport, callback) => {

        const query = 'select id,name,competitionRegion from series where sport=?';
        pool.query(query, [sport], (err, result, fields) => {

            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    currentSeriesInfo: (id, callback) => {

        let series = []

        axios.get('/getSeries/' + id)
            .then(async response => {

                for (let i = 0; i < response.data.data.length; i++) {
                    try {
                        let resMatch = await axios.get('/getMatches/' + id + '/' + response.data.data[i].competition.id)
                        if (resMatch.data.data.length) {
                            let cur_series = response.data.data[i].competition
                            cur_series.events = resMatch.data.data
                            series.push(cur_series)
                        }
                        else {
                            continue
                        }

                    } catch (err) {
                        return callback(err)
                    }
                }
                callback(null, series)
            })
            .catch(error => {
                callback(error)
            })
    },
    addSeries: (data, callback) => {

        const queries = [], queryValues = [];

        axios.get('/getMatches/' + data.sport + '/' + data.id)
            .then(async response => {

                queries.push('insert into series (id,name,sport,competitionRegion) values(?,?,?,?)');
                queryValues.push([data.id, data.name, data.sport, data.competitionRegion]);

                const matches = response.data.data;
                await Promise.all(matches.map(async (match) => {

                    if (data.sport === '4') {
                        queries.push('insert into matches (id,name,openDate,series_id) values(?,?,?,?)');
                        queryValues.push([match.event.id, match.event.name, match.event.openDate, data.id]);
                        queries.push('insert into fancy (id) values(?)')
                        queryValues.push([match.event.id]);
                    }
                    else if (data.sport === '1') {
                        queries.push('insert into matches (id,name,openDate,series_id,timer) values(?,?,?,?,?)');
                        queryValues.push([match.event.id, match.event.name, match.event.openDate, data.id, '10']);
                    }
                    else {
                        queries.push('insert into matches (id,name,openDate,series_id,timer) values(?,?,?,?,?)');
                        queryValues.push([match.event.id, match.event.name, match.event.openDate, data.id, '7']);
                    }

                    try {
                        let res = await axios.get('/getMarkets/' + match.event.id);
                        let markets = res.data.data;
                        let newMarkets = []
                        const n = markets.length
                        for (let i = 0; i < n - 1; i++) {
                            if (markets[i].marketId != markets[i + 1].marketId)
                                newMarkets.push(markets[i])
                        }

                        // Store the last element as whether 
                        // it is unique or repeated, it hasn't 
                        // stored previously 
                        newMarkets.push(markets[n - 1])

                        await Promise.all(newMarkets.map(async (market) => {

                            if (!market || !market.marketId)
                                return null

                            queries.push('insert into market (id,name,marketStartTime,match_id,max) values(?,?,?,?,?)');
                            queryValues.push([market.marketId, market.marketName, market.marketStartTime ? market.marketStartTime : match.event.openDate, match.event.id, '25000']);

                            // if (data.sport === '4') {
                            //     queries.push('insert into market (id,name,marketStartTime,match_id,max) values(?,?,?,?,?)');
                            //     queryValues.push([market.marketId, market.marketName, market.marketStartTime ? market.marketStartTime : match.event.openDate, match.event.id, '25000']);
                            // } else {
                            //     queries.push('insert into market (id,name,marketStartTime,match_id) values(?,?,?,?)');
                            //     queryValues.push([market.marketId, market.marketName, market.marketStartTime ? market.marketStartTime : match.event.openDate, match.event.id]);
                            // }

                            let runners = await axios.get('/getRunners/' + market.marketId);
                            runners = runners.data.data[0].runners;
                            await Promise.all(runners.map((runner) => {

                                queries.push('insert into runner values(?,?,?,?,null,null)');
                                queryValues.push([runner.selectionId, market.marketId, runner.runnerName, runner.sortPriority])
                            }))
                        }))
                    } catch (err) {
                        return callback(err)
                    }

                }))

            }).then(res => {

                transaction(queries, queryValues, (err, result) => {

                    if (err)
                        return callback(err);

                    const key = {
                        type: 'match',
                        sport: data.sport
                    }
                    client.del(JSON.stringify(key), 'matches', (err, reply) => {
                        if (err)
                            return callback(err);

                        callback(null, 'Series added successfully');
                    })
                });
            })
            .catch(error => {
                callback(error)
            })
    },
    addManualMarket: (data, callback) => {

        const query = 'select id from market'
        pool.query(query, [data.eventId], (err, result, fields) => {

            if (err) {
                callback(err)
            }
            else {

                let doesExist = false
                let id
                do {
                    id = Math.floor(Math.random() * 1000000000 + 1)
                    for (const market of result) {
                        if (market.id === id) {
                            doesExist = true
                        }
                        else {
                            continue
                        }
                    }
                } while (doesExist)

                id = '3.' + id.toString()

                const query2 = 'insert into market values(?,?,?,?,?,?,?,?,?)'
                pool.query(query2, [id, data.name, new Date(), data.eventId, data.min, data.max, data.adv_max, 'on', 'yes'], (err, results, fields) => {
                    if (err)
                        return callback(err)

                    client.del(data.eventId, (err, reply) => {

                        if (err)
                            return callback(err)

                        callback(null, 'Market added successfully')
                    })
                })
            }
        })
    },
    addRunner: (data, callback) => {

        const query = 'select selectionId from runner where market_Id=?'
        pool.query(query, [data.marketId], async (err, result, fields) => {

            if (err)
                return callback(err)


            let manual
            try {

                const query1 = 'select manual from market where id=?'
                const res = await pool.query(query1, [data.marketId])
                manual = res[0].manual
            } catch (err) {
                callback(err)
            }

            if (manual === 'yes') {
                const query2 = 'insert into runner values(?,?,?,?,?,?)'
                pool.query(query2, [result.length + 1, data.marketId, data.name, result.length + 1, data.back, data.lay], async (err, results, fields) => {
                    if (err)
                        return callback(err)

                    client.del(data.eventId, (err, reply) => {

                        if (err) {
                            return callback(err)
                        }

                        return callback(null, 'Runner added successfully')
                    })

                })
            }
            else {
                callback(null, "You can't add runners to this market")
            }

        })
    },
    addMarket: (id, callback) => {

        axios.get('/getMarkets/' + id)
            .then(async res => {
                let markets = res.data.data;

                const query = 'select * from market where match_id=?'
                const currentMarkets = await pool.query(query, [id])

                const queries = [], queryValues = []

                await Promise.all(markets.map(async (market) => {

                    let index = currentMarkets.findIndex(cur_market => cur_market.id === market.marketId)

                    if (index === -1) {
                        queries.push('insert into market (id,name,marketStartTime,match_id) values(?,?,?,?)');
                        queryValues.push([market.marketId, market.marketName, market.marketStartTime, id]);

                        try {
                            let runners = await axios.get('/getRunners/' + market.marketId);
                            runners = runners.data.data[0].runners;
                            await Promise.all(runners.map((runner) => {

                                queries.push('insert into runner values(?,?,?,?,null,null)');
                                queryValues.push([runner.selectionId, market.marketId, runner.runnerName, runner.sortPriority])
                            }))
                        } catch (err) {
                            callback(err)
                        }
                    }
                }))
                transaction(queries, queryValues, (err, result) => {

                    if (err)
                        return callback(err);

                    client.del(id, (err, reply) => {

                        if (err) {
                            return callback(err)
                        }

                        return callback(null, result);
                    })
                });
            })
            .catch(err => {
                callback(err);
            })

    },
    addBookmakerMarket: (id, callback) => {

        axios.get('/getBookmakerMarket/' + id)
            .then(async res => {
                let market = res.data.data[0];
                const queries = [], queryValues = []

                queries.push('insert into market (id,name,marketStartTime,match_id) values(?,?,?,?)');
                queryValues.push([market.marketId, market.marketName, market.marketStartTime, id]);

                try {
                    //let runners = await axios.get('/getBookmakerRunners/' + market.marketId);
                    // if (!runners.data.data.length)
                    //   return callback(null, 'Runners not found')

                    let runners = market.runners;
                    let i = 1
                    await Promise.all(runners.map((runner) => {

                        queries.push('insert into runner values(?,?,?,?,null,null)');
                        queryValues.push([runner.selectionId, market.marketId, runner.runnerName, i++])
                    }))
                } catch (err) {
                    return callback(err)
                }
                transaction(queries, queryValues, (err, result) => {

                    if (err)
                        return callback(err);

                    client.del(id, (err, reply) => {

                        if (err)
                            return callback(err)

                        callback(null, 'Bookmaker added successfully');
                    })
                });
            })
            .catch(err => {
                callback(err)
            })

    },
    deleteMarket: (data, callback) => {

        const query = 'select event_id from bets where event_id=? and market_id=? and state=?'
        pool.query(query, [data.eventId, data.marketId, 'matched'], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                if (!result.length) {
                    const query = 'delete from market where id=? and match_id=?';
                    pool.query(query, [data.marketId, data.eventId], (err, result, fields) => {

                        if (err)
                            return callback(err);

                        client.del(data.eventId, (err, reply) => {

                            if (err)
                                return callback(err)

                            callback(null, 'Market removed successfully');
                        })
                    });
                }
                else {
                    callback(null, 'Please settle market before deleting')
                }
            }
        });
    },
    removeSeries: (id, callback) => {

        const query = 'select event_id from bets where state=? and event_id in(select id from matches where series_id=?)'
        pool.query(query, ['matched', id], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                if (!result.length) {
                    const query = 'delete from series where id=?';
                    pool.query(query, [id], (err, result, fields) => {

                        if (err)
                            return callback(err);

                        let sports = ['1', '2', '4']

                        sports = sports.map(sport => {

                            const key = {
                                type: 'match',
                                sport: sport
                            }

                            return JSON.stringify(key)
                        })

                        client.del(...sports, (err, reply) => {
                            if (err)
                                return callback(err);

                            callback(null, 'Series removed successfully');
                        })

                    });
                }
                else {
                    callback(null, 'Please settle matches before deleting')
                }
            }
        });
    },
    toggleMatch: (data, callback) => {

        const query = 'select A.status,B.sport from matches as A,series as B where A.id=? and A.series_id=B.id';
        pool.query(query, [data.id], (err, result1, fields) => {
            if (err)
                return callback(err);

            const queries = [], queryValues = [];
            if (result1[0].status === 'on') {
                queries.push('update matches set status="off" where id=?');
                queries.push('update fancy set status="off" where id=?');
                queries.push('update market set status="off" where match_id=?');
            }
            else {
                queries.push('update matches set status="on" where id=?');
                queries.push('update fancy set status="on" where id=?');
                queries.push('update market set status="on" where match_id=?');
            }
            queryValues.push([data.id]);
            queryValues.push([data.id]);
            queryValues.push([data.id]);

            transaction(queries, queryValues, (err, result) => {

                if (err)
                    return callback(err);

                const key = {
                    type: 'match',
                    sport: result1[0].sport
                }
                client.del(data.id, JSON.stringify(key), (err, reply) => {

                    if (err)
                        return callback(err)

                    callback(null, result);
                })
            });
        });
    },
    toggleMarket: (data, callback) => {

        const query = 'update market set status=IF(status=?,?,?) where id=?';
        pool.query(query, ['on', 'off', 'on', data.id], (err, result, fields) => {
            if (err)
                callback(err);
            else
                client.del(data.eventId, (err, reply) => {

                    if (err)
                        return callback(err)

                    callback(null, 'Market toggled Successfully');
                })
        });
    },
    toggleFancyMarket: (data, callback) => {
        const query = 'update fancy set status=IF(status=?,?,?) where id=?';
        pool.query(query, ['on', 'off', 'on', data.id], (err, result, fields) => {
            if (err)
                return callback(err);

            callback(null, 'Fancy market toggled Successfully');
        });
    },
    updateMatch: (data, callback) => {

        const query = 'select id,sport from series';
        pool.query(query, [data.sport], async (err, result, fields) => {

            if (err)
                return callback(err);

            const queries = [], queryValues = [];
            if (result.length) {
                for (let series of result) {

                    const query = 'select id from matches where series_id=?';
                    try {
                        let results = await pool.query(query, [series.id])
                        let response = await axios.get('/getMatches/' + series.sport + '/' + series.id)
                        const matches = response.data.data;

                        if (matches.length) {

                            await Promise.all(matches.map(async (match) => {

                                let index = results.findIndex(cur_match => cur_match.id === match.event.id)
                                if (index === -1) {
                                    if (series.sport === '4') {
                                        queries.push('insert into matches (id,name,openDate,series_id) values(?,?,?,?)');
                                        queryValues.push([match.event.id, match.event.name, match.event.openDate, series.id]);
                                        queries.push('insert into fancy (id) values(?)')
                                        queryValues.push([match.event.id]);
                                    }
                                    else if (series.sport === '1') {
                                        queries.push('insert into matches (id,name,openDate,series_id,timer) values(?,?,?,?,?)');
                                        queryValues.push([match.event.id, match.event.name, match.event.openDate, series.id, '10']);
                                    }
                                    else {
                                        queries.push('insert into matches (id,name,openDate,series_id,timer) values(?,?,?,?,?)');
                                        queryValues.push([match.event.id, match.event.name, match.event.openDate, series.id, '7']);
                                    }

                                    let res = await axios.get('/getMarkets/' + match.event.id);
                                    //console.log(res.data.data);
                                    let markets = res.data.data;
                                    let newMarkets = []
                                    const n = markets.length
                                    for (let i = 0; i < n - 1; i++) {
                                        if (markets[i].marketId != markets[i + 1].marketId)
                                            newMarkets.push(markets[i])
                                    }

                                    // Store the last element as whether 
                                    // it is unique or repeated, it hasn't 
                                    // stored previously 
                                    newMarkets.push(markets[n - 1])
                                    await Promise.all(newMarkets.map(async (market) => {

                                        if (!market)
                                            return null

                                        queries.push('insert into market (id,name,marketStartTime,match_id,max) values(?,?,?,?,?)');
                                        queryValues.push([market.marketId, market.marketName, market.marketStartTime ? market.marketStartTime : match.event.openDate, match.event.id, '25000']);

                                        // if (series.sport === '4') {
                                        //     queries.push('insert into market (id,name,marketStartTime,match_id,max) values(?,?,?,?,?)');
                                        //     queryValues.push([market.marketId, market.marketName, market.marketStartTime ? market.marketStartTime : match.event.openDate, match.event.id, '25000']);
                                        // } else {
                                        //     queries.push('insert into market (id,name,marketStartTime,match_id) values(?,?,?,?)');
                                        //     queryValues.push([market.marketId, market.marketName, market.marketStartTime ? market.marketStartTime : match.event.openDate, match.event.id]);
                                        // }
                                        let runners = await axios.get('/getRunners/' + market.marketId);
                                        runners = runners.data.data[0].runners;
                                        await Promise.all(runners.map((runner) => {

                                            queries.push('insert into runner values(?,?,?,?,null,null)');
                                            queryValues.push([runner.selectionId, market.marketId, runner.runnerName, runner.sortPriority])
                                        }))
                                    }))
                                }
                            }))
                        }

                    } catch (err) {
                        return callback(err)
                    }
                }
                if (queries.length) {

                    transaction(queries, queryValues, (err, result) => {

                        if (err)
                            return callback(err);

                        let sports = ['1', '2', '4']

                        sports = sports.map(sport => {

                            const key = {
                                type: 'match',
                                sport: sport
                            }

                            return JSON.stringify(key)
                        })

                        client.del(...sports, 'matches', (err, reply) => {
                            if (err)
                                return callback(err);

                            callback(null, 'All series updated successfully');
                        })

                    });
                }
                else {
                    callback(null, 'Series are upto date')
                }

            }
            else {
                callback(null, 'No series to update')
            }
        })
    },
    getSeriesMatches: (id, callback) => {

        const query = 'select A.id,A.name,B.cupRate from matches as A,series as B where A.series_id=? and A.series_id=B.id'
        pool.query(query, [id], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    setCupRate: (data, callback) => {

        const query = 'update series set cupRate=? where id=?'
        pool.query(query, [data.cupRate === '' ? null : data.cupRate, data.id], (err, result, fields) => {
            if (err)
                return callback(err);

            let sports = ['1', '2', '4']

            sports = sports.map(sport => {

                const key = {
                    type: 'match',
                    sport: sport
                }

                return JSON.stringify(key)
            })

            client.del(...sports, 'matches', (err, reply) => {
                if (err)
                    return callback(err);

                callback(null, 'Cup rate set successfully');
            })
        });
    },
    getMatches: (sport, callback) => {

        const query = 'select A.cupRate,B.id,B.name,B.status,B.openDate,B.timer ' +
            'from series as A,matches as B ' +
            'where A.id=B.series_id and B.series_id In ' +
            '(select id from series where sport=?) ' +
            'order by B.openDate asc'
        pool.query(query, [sport], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    deleteMatch: (id, callback) => {

        const query = 'select event_id from bets where event_id =? and state=?'
        pool.query(query, [id, 'matched'], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                if (!result.length) {
                    const query = 'delete from matches where id=?'
                    pool.query(query, [id], (err, result, fields) => {
                        if (err)
                            return callback(err);

                        let sports = ['1', '2', '4']

                        sports = sports.map(sport => {

                            const key = {
                                type: 'match',
                                sport: sport
                            }

                            return JSON.stringify(key)
                        })

                        client.del(...sports, 'matches', id, (err, reply) => {
                            if (err)
                                return callback(err);

                            callback(null, 'Deleted successfully');
                        })
                    });
                }
                else {
                    callback(null, 'Settle Match before deleting');
                }
            }
        })
    },
    getRunners: (id, callback) => {

        const query = 'select * from runner where market_id=?'
        pool.query(query, [id], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    getFancyMarket: (id, callback) => {
        const query = 'select max,min,status,timer from fancy where id=?'
        pool.query(query, [id], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    getFancyMaxMin: (data, callback) => {

        const query1 = 'select max,min from fancy where id=?'
        pool.query(query1, [data.matchId], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                callback(null, result)
            }
        });
    },
    getMatchesToSettle: (sport, callback) => {

        const query = 'select A.event,A.event_id,A.market,A.market_id,A.bet_id,B.openDate ' +
            'from bets as A,matches as B ' +
            'where A.sport=? and B.id=A.event_id and A.type="exchange" and state="matched" or A.type="bookmaker" and A.sport=? and B.id=A.event_id and state="matched" ' +
            'group by A.event,A.event_id,A.market,A.market_id,A.bet_id,B.openDate ';
        pool.query(query, [sport, sport], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    getAllMatchesToSettle: (callback) => {

        const query = 'select A.event,A.event_id,A.market,A.market_id,B.openDate ' +
            'from bets as A,matches as B ' +
            'where B.id=A.event_id and A.type="exchange" and state="matched" or A.type="bookmaker" and B.id=A.event_id and state="matched" ' +
            'group by A.event,A.event_id,A.market,A.market_id,B.openDate ';
        pool.query(query, (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    getFancyEvents: (callback) => {

        const query = 'select event as name,event_id from bets where type="fancy" and state="matched" group by event_id,event';
        pool.query(query, (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    getFanciesToSettle: (event, callback) => {

        const query = 'select runner,runner_id,event_id from bets ' +
            'where event_id=? and type="fancy" and state="matched" ' +
            'group by runner,runner_id,event_id '

        pool.query(query, [event], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    setMinMarket: (data, callback) => {
        const query = 'update market set min=? where id=?';
        pool.query(query, [data.min, data.id], (err, result, fields) => {
            if (err)
                return callback(err);

            client.del(data.eventId, (err, reply) => {
                if (err)
                    return callback(err);

                callback(null, 'Minimum set successfully');
            })
        });
    },
    setMaxMarket: (data, callback) => {
        const query = 'update market set max=?,adv_max=? where id=?';
        pool.query(query, [data.max, data.adv_max, data.id], (err, result, fields) => {
            if (err)
                return callback(err);

            client.del(data.eventId, (err, reply) => {
                if (err)
                    return callback(err);

                callback(null, 'Maximum set successfully');
            })
        });
    },
    setFancyMinMarket: (data, callback) => {
        const query = 'update fancy set min=? where id=?';
        pool.query(query, [data.min, data.id], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, 'Minimum set successfully');
        });
    },
    setFancyMaxMarket: (data, callback) => {
        const query = 'update fancy set max=? where id=?';
        pool.query(query, [data.max, data.id], (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, 'Maximum set successfully');
        });
    },
    settleFancy: (data, callback) => {

        const fancyToSettle = {
            event: data.event,
            runner: data.runner,
            type: 'settle'
        }

        client.get(JSON.stringify(fancyToSettle), (err, result) => {

            if (err) {
                return callback(err)
            }

            if (result) {
                callback(null, 'The fancy is settling...')
            } else {
                client.set(JSON.stringify(fancyToSettle), '1', (err) => {
                    if (err)
                        return callback(err)

                    const query = 'select username from betmap where bet_id in(select bet_id from bets ' +
                        'where state="matched" and type="fancy" and event_id=? and runner_id=?) group by username'
                    pool.query(query, [data.event, data.runner], async (err, result, fields) => {
                        if (err)
                            callback(err);
                        else {

                            const query2 = 'select A.name as sport,B.name as series,C.name as matchName from sports as A,series as B,matches as C where C.id=? and A.event_type=B.sport and B.id=C.series_id';
                            let matchInfo = await pool.query(query2, [data.event])

                            if (!matchInfo.length) {
                                callback(null, 'Match not in database')
                                return
                            }
                            matchInfo = matchInfo[0]
                            const settleDate = new Date()
                            let info = ''
                            for (const key in matchInfo) {
                                if (Object.hasOwnProperty.call(matchInfo, key)) {
                                    const element = matchInfo[key];
                                    info = info + '//' + element
                                }
                            }

                            let queries = [], queryValues = [];
                            for (const user of result) {
                                try {
                                    const query3 = 'select user_rate,odds,selection,stake ' +
                                        'from bets ' +
                                        'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                                        '(select bet_id from betmap where username=?) ' +
                                        'order by user_rate asc';

                                    let fancyBets = await pool.query(query3, [data.event, data.runner, user.username]);
                                    let netProfitArray = fancybook(fancyBets)

                                    let OnlyNetProfit = netProfitArray.map(element => element.net_profit)
                                    let runner_exposure = Math.min.apply(null, OnlyNetProfit)
                                    if (runner_exposure < 0)
                                        runner_exposure = -runner_exposure
                                    else
                                        runner_exposure = 0

                                    let LeftHalf, RightHalf, netProfit

                                    let index = netProfitArray.findIndex(element => element.user_rate === parseFloat(data.pass))
                                    if (index === -1) {

                                        LeftHalf = netProfitArray.filter(element => element.user_rate < data.pass)
                                        RightHalf = netProfitArray.filter(element => element.user_rate > data.pass)

                                        if (LeftHalf.length === 0)
                                            netProfit = RightHalf[0].net_profit
                                        else
                                            netProfit = LeftHalf[LeftHalf.length - 1].net_profit
                                    }
                                    else
                                        netProfit = netProfitArray[index].net_profit



                                    const query4 = 'update users set balance=balance+?,exposure=exposure-?,winnings=winnings+? where username=?'
                                    const query5 = 'update users set winnings=winnings-? where username=(select uplink from isclient where downlink=?) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)))'
                                    const query6 = 'update bets set state="settled",pass=?,profit_loss=IF(user_rate <=?,IF(selection="back",stake * odds / 100, -stake * odds / 100),IF(selection="back",-stake,stake)),profit_loss_wc=IF(user_rate <=?,IF(selection="back",stake * odds / 100, -stake * odds / 100),IF(selection="back",-stake,stake)),settled_at=? ' +
                                        `where type='${data.type}' and state="matched" and event_id=? and runner_id=? and bet_id In ` +
                                        '(select bet_id from betmap where username=?) ' +
                                        'order by placed_at asc'
                                    const query7 = 'insert into transactionmap(username) values(?)';
                                    const query8 = 'SET @trans_id = LAST_INSERT_ID()';
                                    const query9 = 'select @balance:=balance+exposure from users where username=?'
                                    const query10 = 'insert into alltransactions(transaction_id,description,deposited,withdrawn,balance,type,created_at) values(@trans_id,?,?,?,@balance,?,?)';

                                    queries.push(query4, query5, query6, query7, query8, query9, query10)

                                    let queryValue4
                                    let queryValue5
                                    const queryValue6 = [data.pass, data.pass, data.pass, settleDate, data.event, data.runner, user.username]
                                    const queryValue7 = [user.username]
                                    const queryValue8 = []
                                    const queryValue9 = [user.username]
                                    let queryValue10

                                    if (netProfit >= 0) {
                                        queryValue4 = [netProfit + runner_exposure, runner_exposure, netProfit, user.username]
                                        queryValue5 = [netProfit, user.username, user.username, user.username]
                                        queryValue10 = [info + '//' + data.runnerName + '//Result:' + data.pass + '//' + data.event, netProfit, null, 'pl', settleDate]
                                    }
                                    else {
                                        queryValue4 = [netProfit + runner_exposure, runner_exposure, netProfit, user.username]
                                        queryValue5 = [netProfit, user.username, user.username, user.username]
                                        queryValue10 = [info + '//' + data.runnerName + '//Result:' + data.pass + '//' + data.event, null, -netProfit, 'pl', settleDate]
                                    }

                                    queryValues.push(queryValue4, queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10)

                                } catch (err) {
                                    callback(err)
                                }
                            }
                            if (!queries.length) {
                                callback(null, 'No bets found')
                            }
                            else {

                                const query11 = 'select * from blockedfancies where eventId=? and sessionId=?';
                                const res = await pool.query(query11, [data.event, data.runner])

                                if (!res.length) {
                                    queries.push('insert into blockedfancies values(?,?)')
                                    queryValues.push([data.event, data.runner])
                                }

                                transaction(queries, queryValues, (err, result) => {
                                    if (err)
                                        return callback(err);

                                    callback(null, 'Fancy Settled Successfully');
                                });
                            }
                        }
                    })
                })
            }
        })
    },
    undeclareFancy: (data, callback) => {

        const fancyToUndeclare = {
            event: data.eventId,
            runner: data.marketId,
            type: 'undeclare'
        }

        client.get(JSON.stringify(fancyToUndeclare), (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Undeclare in progress...')

            client.set(JSON.stringify(fancyToUndeclare), '1', (err) => {
                if (err)
                    return callback(err)

                const query1 = 'select B.username from bets as A,betmap as B where A.event_id=? and A.runner_id=? and A.type=? and A.bet_id=B.bet_id group by B.username'
                pool.query(query1, [data.eventId, data.marketId, data.type], async (err, result, fields) => {

                    if (err)
                        callback(err);
                    else {

                        const query2 = 'select A.name as sport,B.name as series,C.name as matchName from sports as A,series as B,matches as C where C.id=? and A.event_type=B.sport and B.id=C.series_id';
                        let matchInfo = await pool.query(query2, [data.eventId])

                        if (!matchInfo.length)
                            return callback(null, 'Match not in database')

                        matchInfo = matchInfo[0]
                        let info = ''
                        const settleDate = new Date()

                        for (const key in matchInfo) {
                            if (Object.hasOwnProperty.call(matchInfo, key)) {
                                const element = matchInfo[key];
                                info = info + '//' + element
                            }
                        }

                        const queries = [], queryValues = []

                        for (let user of result) {

                            try {

                                const query3 = 'select sum(Profit_Loss_wc) as Profit_Loss from bets where event_id=? and runner_id=? and type=? and state="settled" and bet_id in(select bet_id from betmap where username=?)'
                                const response = await pool.query(query3, [data.eventId, data.marketId, data.type, user.username])
                                const PL = response[0].Profit_Loss ? response[0].Profit_Loss : 0

                                const query4 = 'select user_rate,odds,selection,stake,state ' +
                                    'from bets ' +
                                    'where type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                                    '(select bet_id from betmap where username=?) ' +
                                    'order by user_rate asc'

                                const results = await pool.query(query4, [data.eventId, data.marketId, user.username])
                                const current_bets = [...results.filter(bet => bet.state === 'matched')]

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

                                let current_exposure = 0;
                                if (current_bets.length) {

                                    let book = fancybook(current_bets)

                                    let netProfitArray = book.map(fancy => {
                                        return fancy.net_profit
                                    })
                                    let min = Math.min.apply(Math, netProfitArray);

                                    if (min < 0) {
                                        current_exposure = -min;
                                    }
                                }

                                const query5 = 'update users set balance=balance-?,winnings=winnings-?,exposure=exposure+? where username=?'
                                const query6 = 'update users set winnings=winnings+? where username=(select uplink from isclient where downlink=?) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)))'
                                const query7 = 'update bets set profit_loss=?,profit_loss_wc=?,settled_at=?,state=? where type=? and event_id=? and runner_id=?'
                                const query8 = 'insert into transactionmap(username) values(?)';
                                const query9 = 'SET @trans_id = LAST_INSERT_ID()';
                                const query10 = 'select @balance:=balance+exposure from users where username=?'
                                const query11 = 'insert into alltransactions(transaction_id,description,deposited,withdrawn,balance,type,created_at) values(@trans_id,?,?,?,@balance,?,?)';

                                queries.push(query5, query6, query7, query8, query9, query10, query11)

                                const queryValue5 = [PL < 0 ? 0 : (PL + exposure - current_exposure), PL, exposure - current_exposure, user.username]
                                const queryValue6 = [PL, user.username, user.username, user.username]
                                const queryValue7 = [null, null, null, 'matched', data.type, data.eventId, data.marketId]
                                const queryValue8 = [user.username]
                                const queryValue9 = []
                                const queryValue10 = [user.username]
                                let queryValue11

                                if (PL < 0) {
                                    queryValue11 = [info + '//' + data.runnerName + '//undeclared//' + data.eventId, -PL, null, 'pl', settleDate]
                                }
                                else {
                                    queryValue11 = [info + '//' + data.runnerName + '//undeclared//' + data.eventId, null, PL, 'pl', settleDate]
                                }

                                queryValues.push(queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10, queryValue11)

                            } catch (err) {
                                callback(err)
                            }
                        }

                        queries.push('delete from blockedfancies where eventId=? and sessionId=?')
                        queryValues.push([data.eventId, data.marketId])

                        transaction(queries, queryValues, (err, result) => {

                            if (err)
                                return callback(err);

                            callback(null, 'Undeclared successfully');
                        });
                    }
                })
            })
        })
    },
    voidFancy: (data, callback) => {

        const fancyToVoid = {
            event: data.event,
            runner: data.runner,
            type: 'void'
        }

        client.get(JSON.stringify(fancyToVoid), (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Void in progress...')

            client.set(JSON.stringify(fancyToVoid), '1', (err) => {
                if (err)
                    return callback(err)

                const query = 'select username from betmap where bet_id in(select bet_id from bets ' +
                    'where state="matched" and type="fancy" and event_id=? and runner_id=?) group by username'
                pool.query(query, [data.event, data.runner], async (err, result, fields) => {
                    if (err)
                        callback(err);
                    else {

                        const query1 = 'select A.name as sport,B.name as series,C.name as matchName from sports as A,series as B,matches as C where C.id=? and A.event_type=B.sport and B.id=C.series_id';
                        let matchInfo = await pool.query(query1, [data.event])
                        matchInfo = matchInfo[0]
                        let info = ''
                        const settleDate = new Date()
                        for (const key in matchInfo) {
                            if (Object.hasOwnProperty.call(matchInfo, key)) {
                                const element = matchInfo[key];
                                info = info + '//' + element
                            }
                        }
                        info = info + '//' + data.runnerName

                        let queries = [], queryValues = [];
                        for (const user of result) {

                            try {
                                const query2 = 'select user_rate,odds,selection,stake ' +
                                    'from bets ' +
                                    'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                                    '(select bet_id from betmap where username=?) ' +
                                    'order by user_rate asc';

                                let fancyBets = await pool.query(query2, [data.event, data.runner, user.username]);
                                let netProfitArray = fancybook(fancyBets)

                                let OnlyNetProfit = netProfitArray.map(element => element.net_profit)
                                let runner_exposure = Math.min.apply(null, OnlyNetProfit)
                                if (runner_exposure < 0)
                                    runner_exposure = -runner_exposure
                                else
                                    runner_exposure = 0

                                const query3 = 'update users set balance=balance+?,exposure=exposure-? where username=?'
                                const query4 = 'update bets set state="void",profit_loss=0,profit_loss_wc=0,settled_at=? ' +
                                    `where type='${data.type}' and state="matched" and event_id=? and runner_id=? and bet_id In ` +
                                    '(select bet_id from betmap where username=?) ' +
                                    'order by placed_at asc'
                                const query5 = 'insert into transactionmap(username) values(?)';
                                const query6 = 'SET @trans_id = LAST_INSERT_ID()';
                                const query7 = 'select @balance:=balance+exposure from users where username=?'
                                const query8 = 'insert into alltransactions(transaction_id,description,balance,type,created_at) values(@trans_id,?,@balance,?,?)';

                                queries.push(query3, query4, query5, query6, query7, query8)

                                const queryValue3 = [runner_exposure, runner_exposure, user.username]
                                const queryValue4 = [settleDate, data.event, data.runner, user.username]
                                const queryValue5 = [user.username]
                                const queryValue6 = []
                                const queryValue7 = [user.username]
                                const queryValue8 = [info + '//Result:voided//' + data.event, 'pl', settleDate]

                                queryValues.push(queryValue3, queryValue4, queryValue5, queryValue6, queryValue7, queryValue8)

                            }
                            catch (err) {
                                callback(err)
                            }
                        }
                        if (!queries.length) {
                            callback(null, 'No record found')
                        }
                        else {

                            transaction(queries, queryValues, (err, result) => {
                                if (err)
                                    return callback(err);

                                callback(null, 'Fancy voided Successfully');

                            });
                        }
                    }
                })
            })
        })
    },
    settleMatch: (data, callback) => {

        const eventToSettle = {
            eventId: data.eventId,
            marketId: data.marketId,
            type: 'settle'
        }

        client.get(JSON.stringify(eventToSettle), (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Match is settling...')

            client.set(JSON.stringify(eventToSettle), '1', (err) => {
                if (err)
                    return callback(err)

                const query = 'select username from clientbookmap where event=? and market=?';
                pool.query(query, [data.eventId, data.marketId], async (err, result, fields) => {
                    if (err)
                        callback(err);
                    else {

                        const query1 = 'select A.name as sport,B.name as series,C.name as matchName,D.name as market from sports as A,series as B,matches as C,market as D where C.id=? and D.id=? and A.event_type=B.sport and B.id=C.series_id and C.id=D.match_id';
                        let matchInfo = await pool.query(query1, [data.eventId, data.marketId])
                        matchInfo = matchInfo[0]
                        let info = ''
                        const settleDate = new Date()
                        for (const key in matchInfo) {
                            if (Object.hasOwnProperty.call(matchInfo, key)) {
                                const element = matchInfo[key];
                                info = info + '//' + element
                            }
                        }
                        const queries = [], queryValues = [];
                        for (const user of result) {
                            try {
                                let com = 0
                                if (data.type === 'exchange' || data.type === 'bookmaker') {
                                    const query1 = `select commission from users where username=?`
                                    const res = await pool.query(query1, [user.username]);
                                    com = res[0].commission;
                                }

                                const query2 = 'select B.netProfit,C.event_exposure ' +
                                    'from clientbookmap as A,clientbook as B,eventexposure as C ' +
                                    'where A.username=? and A.event=? and A.market=? and A.id=B.id and A.id=C.id and B.runner=?';
                                let res = await pool.query(query2, [user.username, data.eventId, data.marketId, data.winner]);

                                let netProfit = res[0].netProfit;
                                let event_exposure = res[0].event_exposure;

                                const query5 = 'update users set balance=balance+?,exposure=exposure-?,winnings=winnings+? where username=?'
                                const query6 = 'update users set winnings=winnings-? where username=(select uplink from isclient where downlink=?) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)))'
                                const query7 = 'update bets set state="settled",winner=?,profit_loss=IF(runner_id=?,IF(selection="back",stake * (odds - 1), -stake * (odds - 1)),IF(selection="back",-stake,stake)),profit_loss_wc=IF(?>0,?*IF(runner_id=?,IF(selection="back",stake * (odds - 1), -stake * (odds - 1)),IF(selection="back",-stake,stake)),IF(runner_id=?,IF(selection="back",stake * (odds - 1), -stake * (odds - 1)),IF(selection="back",-stake,stake))),settled_at=? ' +
                                    `where type='${data.type}' and state="matched" and event_id=? and market_id=? and bet_id In ` +
                                    '(select bet_id from betmap where username=?) ' +
                                    'order by placed_at asc'
                                const query8 = 'insert into transactionmap(username) values(?)';
                                const query9 = 'SET @trans_id = LAST_INSERT_ID()';
                                const query10 = 'select @balance:=balance+exposure from users where username=?'
                                const query11 = 'insert into alltransactions(transaction_id,description,deposited,withdrawn,balance,type,created_at) values(@trans_id,?,?,?,@balance,?,?)';

                                queries.push(query5, query6, query7, query8, query9, query10, query11)

                                let queryValue5
                                let queryValue6
                                const queryValue7 = [data.winnerName, data.winner, netProfit, (1 - com), data.winner, data.winner, settleDate, data.eventId, data.marketId, user.username]
                                const queryValue8 = [user.username]
                                const queryValue9 = []
                                const queryValue10 = [user.username]
                                let queryValue11

                                if (netProfit >= 0) {
                                    queryValue5 = [netProfit * (1 - com) + event_exposure, event_exposure, netProfit * (1 - com), user.username]
                                    queryValue6 = [netProfit * (1 - com), user.username, user.username, user.username]
                                    queryValue11 = [info + '//Result:' + data.winnerName + '//' + data.eventId, netProfit * (1 - com), null, 'pl', settleDate]
                                }
                                else {
                                    queryValue5 = [netProfit + event_exposure, event_exposure, netProfit, user.username]
                                    queryValue6 = [netProfit, user.username, user.username, user.username]
                                    queryValue11 = [info + '//Result:' + data.winnerName + '//' + data.eventId, null, -netProfit, 'pl', settleDate]
                                }

                                queryValues.push(queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10, queryValue11)

                            } catch (err) {
                                return callback(err)
                            }
                        }
                        if (!queries.length) {
                            callback(null, 'No record found in clientbook')
                        }
                        else {
                            queries.push('delete from clientbookmap where event=? and market=?')
                            queryValues.push([data.eventId, data.marketId])
                            queries.push('update market set status=? where id=?')
                            queryValues.push(['off', data.marketId])

                            transaction(queries, queryValues, (err, result) => {

                                if (err)
                                    return callback(err);

                                callback(null, 'Match Settled Successfully');

                            });
                        }
                    }
                })
            })
        })
    },
    undeclareMatch: (data, callback) => {

        const eventToUndeclare = {
            eventId: data.eventId,
            marketId: data.marketId,
            type: 'undeclare'
        }

        client.get(JSON.stringify(eventToUndeclare), (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Undeclare in progress')

            client.set(JSON.stringify(eventToUndeclare), '1', (err) => {
                if (err)
                    return callback(err)

                const query1 = 'select B.username from bets as A,betmap as B where A.event_id=? and A.market_id=? and A.type=? and A.bet_id=B.bet_id group by B.username'
                pool.query(query1, [data.eventId, data.marketId, data.type], async (err, result, fields) => {

                    if (err)
                        return callback(err);

                    const query = 'select A.name as sport,B.name as series,C.name as matchName,D.name as market from sports as A,series as B,matches as C,market as D where C.id=? and D.id=? and A.event_type=B.sport and B.id=C.series_id and C.id=D.match_id';
                    let matchInfo = await pool.query(query, [data.eventId, data.marketId])
                    matchInfo = matchInfo[0]
                    let info = ''
                    const settleDate = new Date()
                    for (const key in matchInfo) {
                        if (Object.hasOwnProperty.call(matchInfo, key)) {
                            const element = matchInfo[key];
                            info = info + '//' + element
                        }
                    }

                    const queries = [], queryValues = []

                    for (let user of result) {

                        try {

                            const query2 = 'select sum(Profit_Loss_wc) as Profit_Loss from bets where event_id=? and market_id=? and type=? and state!="matched" and bet_id in(select bet_id from betmap where username=?)'
                            const response = await pool.query(query2, [data.eventId, data.marketId, data.type, user.username])
                            if (!response.length)
                                return callback(null, 'No bets found')

                            const PL = response[0].Profit_Loss

                            const query3 = 'update users set balance=balance-?,winnings=winnings-? where username=?'
                            const query4 = 'update users set winnings=winnings+? where username=(select uplink from isclient where downlink=?) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)) or username=(select uplink from isclient where downlink=(select uplink from isclient where downlink=(select uplink from isclient where downlink=?)))'
                            const query5 = 'update bets set profit_loss=?,profit_loss_wc=?,settled_at=?,state=? where type=? and event_id=? and market_id=?'

                            queries.push(query3, query4, query5)

                            const queryValue3 = [PL, PL, user.username]
                            const queryValue4 = [PL, user.username, user.username, user.username]
                            const queryValue5 = [null, null, null, 'matched', data.type, data.eventId, data.marketId]
                            queryValues.push(queryValue3, queryValue4, queryValue5)

                            const query6 = 'select B.username,A.bet_id,A.event_id,A.event,A.market,A.market_id,A.runner,A.runner_id,A.stake,A.odds,A.selection,A.sport,A.placed_at,A.type,A.IP_Address from bets as A,betmap as B where A.event_id=? and A.bet_id=B.bet_id and A.market_id=? and A.type=? and B.username=?'
                            const bets = await pool.query(query6, [data.eventId, data.marketId, data.type, user.username])

                            const query7 = 'select username ' +
                                'from clientbookmap ' +
                                'where username=? and event=? and market=?'
                            let betExist = await pool.query(query7, [user.username, data.eventId, data.marketId])
                            betExist = betExist.length

                            for (let bet of bets) {

                                let profit, liability, otherRunners;

                                if (bet.selection === 'back') {
                                    profit = bet.stake * (bet.odds - 1);
                                    liability = -bet.stake
                                }
                                else {
                                    profit = bet.stake
                                    liability = -bet.stake * (bet.odds - 1)
                                }

                                const query5 = 'select B.selectionId from market as A,runner as B where A.id=B.market_id and A.match_id=? and A.id=? '
                                let allRunners = await pool.query(query5, [data.eventId, data.marketId])

                                if (!allRunners.length) {
                                    callback(null, 'Match not present in database')
                                    return
                                }

                                allRunners = allRunners.map(runner => {
                                    return runner.selectionId
                                })

                                otherRunners = allRunners.filter(runner => runner !== bet.runner_id);

                                const bet_data = {
                                    betId: bet.bet_id,
                                    odds: bet.odds,
                                    selection: bet.selection,
                                    stake: bet.stake,
                                    profit: Math.round(profit * 100) / 100,
                                    liability: Math.round(liability * 100) / 100,
                                    runner: bet.runner_id,
                                    otherRunners: otherRunners,
                                    event: bet.event_id,
                                    eventName: bet.event,
                                    market: bet.market,
                                    runnerName: bet.runner,
                                    type: bet.type,
                                    marketId: bet.market_id,
                                    IP_Address: bet.IP_Address,
                                    sport: bet.sport,
                                    created_at: bet.placed_at,
                                    c_username: bet.username,
                                    betExist: betExist
                                }

                                createClientBook(bet_data, queries, queryValues);
                                betExist = 1
                            }

                            const query8 = 'insert into transactionmap(username) values(?)';
                            const query9 = 'SET @trans_id = LAST_INSERT_ID()';
                            const query10 = 'select @balance:=balance+exposure from users where username=?'
                            const query11 = 'insert into alltransactions(transaction_id,description,deposited,withdrawn,balance,type,created_at) values(@trans_id,?,?,?,@balance,?,?)';

                            queries.push(query8, query9, query10, query11)

                            const queryValue8 = [user.username]
                            const queryValue9 = []
                            const queryValue10 = [user.username]
                            let queryValue11

                            if (PL < 0) {
                                queryValue11 = [info + '//undeclared//' + data.eventId, -PL, null, 'pl', settleDate]
                            }
                            else {
                                queryValue11 = [info + '//undeclared//' + data.eventId, null, PL, 'pl', settleDate]
                            }

                            queryValues.push(queryValue8, queryValue9, queryValue10, queryValue11)

                        } catch (err) {
                            callback(err);
                        }

                    }

                    transaction(queries, queryValues, (err, result) => {

                        if (err)
                            return callback(err);

                        callback(null, 'Undeclared successfully');

                    });
                })
            })
        })

    },
    voidBets: (data, callback) => {

        const betsToVoid = {
            bets: data,
            type: 'void'
        }

        client.get(JSON.stringify(betsToVoid), (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Void in progress')

            client.set(JSON.stringify(betsToVoid), '1', async (err) => {
                if (err)
                    return callback(err)

                const queries = [], queryValues = []
                let marketsToRegister = [], fanciesToRegister = [];

                const settleDate = new Date()

                for (const betId of data) {

                    try {
                        const query = 'select A.event_id,A.event,A.runner_id,A.runner,A.market_id,A.market,A.type,A.user_rate,A.odds,A.selection,A.stake,A.sport,B.username from bets as A,betmap as B where A.bet_id=? and A.bet_id=B.bet_id'
                        const result = await pool.query(query, [betId])
                        let bet = result[0]

                        const query1 = 'update bets set state=?,profit_loss=?,profit_loss_wc=?,settled_at=? where bet_id=?'
                        const queryValue1 = ['void', 0, 0, settleDate, betId]

                        queries.push(query1)
                        queryValues.push(queryValue1)

                        if (bet.type === 'fancy') {

                            fanciesToRegister.push({ sport: bet.sport, event: bet.event, runner: bet.runner, username: bet.username, eventId: bet.event_id })

                            const query = 'select user_rate,odds,selection,stake ' +
                                'from bets ' +
                                'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                                '(select bet_id from betmap where username=?) ' +
                                'order by user_rate asc';

                            const results = await pool.query(query, [bet.event_id, bet.runner_id, bet.username])

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
                                user_rate: bet.user_rate,
                                odds: bet.odds,
                                selection: bet.selection === 'lay' ? 'back' : 'lay',
                                stake: bet.stake
                            }
                            fancyBets.push(newFancy);
                            let book = fancybook(fancyBets)

                            let netProfitArray = book.map(fancy => {
                                return fancy.net_profit
                            })
                            let min = Math.min.apply(Math, netProfitArray);

                            if (min < 0) {
                                new_exposure = -min;
                            }

                            const query2 = 'update users set balance=balance+?, exposure=exposure+? where username=?';
                            queries.push(query2)

                            const queryValue2 = [old_exposure - new_exposure, new_exposure - old_exposure, bet.username]
                            queryValues.push(queryValue2)

                        } else {

                            marketsToRegister.push({ sport: bet.sport, event: bet.event, market: bet.market, username: bet.username, eventId: bet.event_id })

                            let profit, liability, otherRunners;

                            if (bet.selection === 'back') {
                                profit = -bet.stake * (bet.odds - 1);
                                liability = bet.stake
                            }
                            else {
                                profit = -bet.stake
                                liability = bet.stake * (bet.odds - 1)
                            }

                            const query2 = 'select B.selectionId from market as A,runner as B where A.id=B.market_id and A.match_id=? and A.id=? '
                            let allRunners = await pool.query(query2, [bet.event_id, bet.market_id])

                            allRunners = allRunners.map(runner => {
                                return runner.selectionId
                            })
                            otherRunners = allRunners.filter(runner => runner !== bet.runner_id);

                            const reverse = {
                                c_username: bet.username,
                                event: bet.event_id,
                                marketId: bet.market_id,
                                runner: bet.runner_id,
                                profit: profit,
                                liability: liability,
                                otherRunners: otherRunners,
                                selection: bet.selection
                            }
                            createClientBookWithOutRegister(reverse, queries, queryValues)
                        }

                    } catch (err) {
                        callback(err);
                    }
                }

                marketsToRegister = removeDups(marketsToRegister)
                fanciesToRegister = removeDups(fanciesToRegister)

                const allMarketEvents = marketsToRegister.map(event => {
                    return { event: event.event }
                })

                const allFancyEvents = fanciesToRegister.map(event => {
                    return { event: event.event }
                })

                let allEvents = allMarketEvents.concat(allFancyEvents)

                allEvents = removeDups(allEvents)

                for (let i = 0; i < allEvents.length; i++) {

                    const query = 'select A.name from series as A,matches as B where A.id=B.series_id and B.name=?'
                    const result = await pool.query(query, [allEvents[i].event])

                    const newEvent = {
                        event: allEvents[i].event,
                        series: result[0].name
                    }

                    allEvents[i] = { ...newEvent }
                }

                fanciesToRegister.forEach(event => {

                    const series = allEvents.filter(cur_event => cur_event.event === event.event)[0].series

                    let cur_event = {
                        sport: event.sport,
                        series: series,
                        match: event.event,
                        runner: event.runner
                    }

                    let info = ''

                    for (const key in cur_event) {
                        if (Object.hasOwnProperty.call(cur_event, key)) {
                            const element = cur_event[key];
                            info = info + '//' + element
                        }
                    }

                    const query1 = 'insert into transactionmap(username) values(?)';
                    const query2 = 'SET @trans_id = LAST_INSERT_ID()';
                    const query3 = 'select @balance:=balance+exposure from users where username=?'
                    const query4 = 'insert into alltransactions(transaction_id,description,balance,type,created_at) values(@trans_id,?,@balance,?,?)';

                    queries.push(query1, query2, query3, query4)

                    const queryValue1 = [event.username]
                    const queryValue2 = []
                    const queryValue3 = [event.username]
                    const queryValue4 = [info + '//Result:voided//' + event.eventId, 'pl', new Date()]

                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4)

                })

                marketsToRegister.forEach(event => {

                    const series = allEvents.filter(cur_event => cur_event.event === event.event)[0].series

                    let cur_event = {
                        sport: event.sport,
                        series: series,
                        match: event.event,
                        market: event.market
                    }

                    let info = ''

                    for (const key in cur_event) {
                        if (Object.hasOwnProperty.call(cur_event, key)) {
                            const element = cur_event[key];
                            info = info + '//' + element
                        }
                    }

                    const query1 = 'insert into transactionmap(username) values(?)';
                    const query2 = 'SET @trans_id = LAST_INSERT_ID()';
                    const query3 = 'select @balance:=balance+exposure from users where username=?'
                    const query4 = 'insert into alltransactions(transaction_id,description,balance,type,created_at) values(@trans_id,?,@balance,?,?)';

                    queries.push(query1, query2, query3, query4)

                    const queryValue1 = [event.username]
                    const queryValue2 = []
                    const queryValue3 = [event.username]
                    const queryValue4 = [info + '//Result:voided//' + event.eventId, 'pl', new Date()]

                    queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4)

                })

                transaction(queries, queryValues, (err, result) => {

                    if (err)
                        return callback(err);

                    callback(null, 'Bets voided Successfully')

                });
            })
        })
    },
    deleteBets: (data, callback) => {


        const betsToDelete = {
            bets: data,
            type: 'delete'
        }

        client.get(JSON.stringify(betsToDelete), (err, result) => {

            if (err)
                return callback(err)

            if (result)
                return callback(null, 'Void in progress')

            client.set(JSON.stringify(betsToDelete), '1', async (err) => {
                if (err)
                    return callback(err)

                const queries = [], queryValues = []

                for (const betId of data) {

                    try {
                        const query = 'select A.event_id,A.event,A.runner_id,A.runner,A.market_id,A.market,A.type,A.user_rate,A.odds,A.selection,A.stake,A.sport,B.username from bets as A,betmap as B where A.bet_id=? and A.bet_id=B.bet_id'
                        const result = await pool.query(query, [betId])
                        let bet = result[0]

                        const query1 = 'delete from betmap where bet_id=?'
                        const queryValue1 = [betId]

                        queries.push(query1)
                        queryValues.push(queryValue1)

                        if (bet.type === 'fancy') {

                            const query = 'select user_rate,odds,selection,stake ' +
                                'from bets ' +
                                'where state="matched" and type="fancy" and event_id=? and runner_id=? and bet_id IN ' +
                                '(select bet_id from betmap where username=?) ' +
                                'order by user_rate asc';

                            const results = await pool.query(query, [bet.event_id, bet.runner_id, bet.username])

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
                                user_rate: bet.user_rate,
                                odds: bet.odds,
                                selection: bet.selection === 'lay' ? 'back' : 'lay',
                                stake: bet.stake
                            }
                            fancyBets.push(newFancy);
                            let book = fancybook(fancyBets)

                            let netProfitArray = book.map(fancy => {
                                return fancy.net_profit
                            })
                            let min = Math.min.apply(Math, netProfitArray);

                            if (min < 0) {
                                new_exposure = -min;
                            }

                            const query2 = 'update users set balance=balance+?, exposure=exposure+? where username=?';
                            queries.push(query2)

                            const queryValue2 = [old_exposure - new_exposure, new_exposure - old_exposure, bet.username]
                            queryValues.push(queryValue2)

                        } else {

                            let profit, liability, otherRunners;

                            if (bet.selection === 'back') {
                                profit = -bet.stake * (bet.odds - 1);
                                liability = bet.stake
                            }
                            else {
                                profit = -bet.stake
                                liability = bet.stake * (bet.odds - 1)
                            }

                            const query2 = 'select B.selectionId from market as A,runner as B where A.id=B.market_id and A.match_id=? and A.id=? '
                            let allRunners = await pool.query(query2, [bet.event_id, bet.market_id])

                            allRunners = allRunners.map(runner => {
                                return runner.selectionId
                            })
                            otherRunners = allRunners.filter(runner => runner !== bet.runner_id);

                            const reverse = {
                                c_username: bet.username,
                                event: bet.event_id,
                                marketId: bet.market_id,
                                runner: bet.runner_id,
                                profit: profit,
                                liability: liability,
                                otherRunners: otherRunners,
                                selection: bet.selection
                            }
                            createClientBookWithOutRegister(reverse, queries, queryValues)
                        }

                    } catch (err) {
                        callback(err);
                    }
                }

                transaction(queries, queryValues, (err, result) => {

                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, 'Bets deleted Successfully')
                    }
                });
            })
        })
    },
    voidMatch: (data, callback) => {

        const eventToVoid = {
            eventId: data.eventId,
            marketId: data.marketId,
            type: 'void'
        }

        client.get(JSON.stringify(eventToVoid), (err, result) => {

            if (err) {
                return callback(err)
            }

            if (result) {
                callback(null, 'Match void in progress...')
            } else {
                client.set(JSON.stringify(eventToVoid), '1', (err) => {
                    if (err) {
                        return callback(err)
                    }

                    const query = 'select username from clientbookmap where event=? and market=?';
                    pool.query(query, [data.eventId, data.marketId], async (err, result, fields) => {
                        if (err)
                            callback(err);
                        else {

                            const query1 = 'select A.name as sport,B.name as series,C.name as matchName,D.name as market from sports as A,series as B,matches as C,market as D where C.id=? and D.id=? and A.event_type=B.sport and B.id=C.series_id and C.id=D.match_id';
                            let matchInfo = await pool.query(query1, [data.eventId, data.marketId])
                            matchInfo = matchInfo[0]
                            let info = ''
                            for (const key in matchInfo) {
                                if (Object.hasOwnProperty.call(matchInfo, key)) {
                                    const element = matchInfo[key];
                                    info = info + '//' + element
                                }
                            }
                            const settleDate = new Date()
                            const queries = [], queryValues = [];
                            for (const user of result) {
                                try {
                                    const query2 = 'select event_exposure from eventexposure where id=(select id from clientbookmap where username=? and event=? and market=?)';
                                    let res = await pool.query(query2, [user.username, data.eventId, data.marketId]);
                                    let event_exposure = res[0].event_exposure;

                                    try {

                                        const query5 = 'update users set balance=balance+?,exposure=exposure-? where username=?'
                                        const query6 = 'update bets set state="void",profit_loss=0,profit_loss_wc=0,settled_at=? ' +
                                            `where type='${data.type}' and state="matched" and event_id=? and market_id=? and bet_id In ` +
                                            '(select bet_id from betmap where username=?) ' +
                                            'order by placed_at asc'
                                        const query7 = 'insert into transactionmap(username) values(?)';
                                        const query8 = 'SET @trans_id = LAST_INSERT_ID()';
                                        const query9 = 'select @balance:=balance+exposure from users where username=?'
                                        const query10 = 'insert into alltransactions(transaction_id,description,balance,type,created_at) values(@trans_id,?,@balance,?,?)';

                                        queries.push(query5, query6, query7, query8, query9, query10)

                                        const queryValue5 = [event_exposure, event_exposure, user.username]
                                        const queryValue6 = [settleDate, data.eventId, data.marketId, user.username]
                                        const queryValue7 = [user.username]
                                        const queryValue8 = []
                                        const queryValue9 = [user.username]
                                        const queryValue10 = [info + '//Result:voided//' + data.eventId, 'pl', settleDate]

                                        queryValues.push(queryValue5, queryValue6, queryValue7, queryValue8, queryValue9, queryValue10)

                                    } catch (err) {
                                        callback(err)
                                    }
                                } catch (err) {
                                    callback(err)
                                }
                            }
                            if (!queries.length) {
                                callback(null, 'No record found in clientbook')
                            }
                            else {
                                queries.push('delete from clientbookmap where event=? and market=?')
                                queryValues.push([data.eventId, data.marketId])
                                queries.push('update market set status=? where id=?')
                                queryValues.push(['off', data.marketId])

                                transaction(queries, queryValues, (err, result) => {

                                    if (err)
                                        return callback(err);

                                    client.del(JSON.stringify(eventToVoid), (err, reply) => {
                                        if (err)
                                            return callback(err)

                                        callback(null, 'Match voided Successfully')
                                    })

                                });
                            }
                        }
                    })
                })
            }
        })
    },
    getSeriesBySport: (sport, callback) => {

        const query = 'select name,id from series where sport=?';
        pool.query(query, [sport], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                callback(null, result);
            }
        });
    },
    getAllMatches: (callback) => {

        const query = 'select B.name as matchName,B.id as matchId,A.cupRate,A.sport ' +
            'from series as A,matches as B ' +
            'where B.status="on" and A.id=B.series_id ' +
            'order by B.openDate asc'

        pool.query(query, (err, result, fields) => {
            if (err)
                callback(err);
            else
                callback(null, result);
        });
    },
    getMatchesBySeries: (seriesId, callback) => {

        const query = 'select B.name,B.id ' +
            'from series as A,matches as B ' +
            'where A.id=? and B.status="on" and A.id=B.series_id ';
        pool.query(query, [seriesId], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                callback(null, result);
            }
        });
    },
    getMarkets: (matchId, callback) => {

        const query2 = 'select * from market where match_id=?'
        pool.query(query2, [matchId], async (err, result, fields) => {
            if (err)
                callback(err);
            else {
                for (const market of result) {

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
                        callback(err)
                    }

                }
                callback(null, result);
            }
        })
    },
    matchInfo: (eventId, callback) => {

        const query = 'select A.openDate,A.name,B.sport from matches as A,series as B where A.id=? and A.series_id=B.id'
        pool.query(query, [eventId], (err, result) => {

            if (err) {
                callback(err)
            }
            else {
                callback(null, result)
            }
        })
    },
    getAllBets: (callback) => {

        const query = 'select B.username as client,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper,A.bet_id,A.placed_at,A.event,A.event_id,A.market,A.runner,A.odds,A.user_rate,A.selection,A.stake,A.sport,A.type,A.IP_Address ' +
            'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
            'where A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and A.state="matched" ' +
            'order by A.placed_at desc'

        pool.query(query, (err, results, fields) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, results);
            }
        });
    },
    setTimer: (data, callback) => {
        const query = 'update matches set timer=? where id=?'

        pool.query(query, [data.timer, data.matchId], (error, results, fields) => {
            if (error)
                callback(error);
            else
                callback(null, 'Timer set successfully');
        })
    },
    setFancyTimer: (data, callback) => {
        const query = 'update fancy set timer=? where id=?'

        pool.query(query, [data.timer, data.matchId], (error, results, fields) => {
            if (error)
                callback(error);
            else
                callback(null, 'Timer set successfully');
        })
    },
    setMessage: (data, callback) => {

        const query = 'update superadmin set message=?'

        pool.query(query, [data.message], (error, results, fields) => {
            if (error)
                return callback(error);

            client.del('message', (err, reply) => {
                if (err)
                    return callback(err);

                callback(null, results);
            })
        })
    },
    isBlocked: (data, callback) => {

        const query = 'select * from blockedfancies where eventId=? and sessionId=?'
        pool.query(query, [data.eventId, data.sessionId], (err, results, fields) => {
            if (err) {
                callback(err)
            }
            else {
                if (!results.length) {
                    callback(null, false)
                } else {
                    callback(null, true)
                }
            }
        })
    },
    toggleFancyStatus: (data, callback) => {

        const query1 = 'select * from blockedfancies where eventId=? and sessionId=?'
        pool.query(query1, [data.eventId, data.sessionId], (err, result1, fields) => {
            if (err) {
                callback(err)
            }
            else {

                let query2

                if (!result1.length) {

                    query2 = 'insert into blockedfancies values(?,?)'
                } else {

                    query2 = 'delete from blockedfancies where eventId=? and sessionId=?'
                }
                pool.query(query2, [data.eventId, data.sessionId], (err, result2, fields) => {
                    if (err) {
                        callback(err)
                    }
                    else {
                        callback(null, 'ok')
                    }
                })
            }
        })
    },
    getEventHistory: (data, callback) => {

        const query = "select * from(" +
            "select event_id,event,market,market_id,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,winner,sport " +
            "from bets " +
            "where type='exchange' and state!=?" + (data.sport === 'All' ? ' ' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') or type='bookmaker' and state!=?" + (data.sport === 'All' ? ' ' : " and sport=?") + "  and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30')" +
            "group by event_id,event,market,market_id,type,settled_at,winner,sport " +
            "union all " +
            "select event_id,event,runner,runner_id,type,-sum(Profit_Loss_wc) as Profit_Loss,settled_at,pass,sport " +
            "from bets " +
            "where type='fancy' and state!=?" + (data.sport === 'All' ? ' ' : " and sport=?") + " and settled_at between convert_tz(?,'+00:00','-5:30') and convert_tz(?,'+00:00','-5:30') " +
            "group by event_id,event,runner,runner_id,type,settled_at,pass,sport) results " +
            "order by settled_at desc"

        let queryValue

        if (data.sport === 'All') {
            queryValue = ["matched", data.from, data.to, "matched", data.from, data.to, "matched", data.from, data.to]
        } else {
            queryValue = ["matched", data.sport, data.from, data.to, "matched", data.sport, data.from, data.to, "matched", data.sport, data.from, data.to]
        }

        pool.query(query, queryValue, (err, result, fields) => {
            if (err)
                callback(err);
            else {
                let total = 0

                for (const event of result) {
                    total = total + event.Profit_Loss
                }

                callback(null, result, total);
            }
        });
    },
    showBetHistory: (data, callback) => {

        let query = 'select A.bet_id,A.event,A.market,A.runner,A.odds,A.selection,A.stake,A.state,A.user_rate,A.winner,A.type,A.sport,A.profit_loss_wc as profit_loss,A.placed_at,A.settled_at,B.username,C.uplink as master,D.uplink as supermaster,E.uplink as seniorsuper ' +
            'from bets as A,betmap as B,isclient as C,isclient as D,isclient as E ' +
            'where (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and market=? and event_id=? ' +
            'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and market=? and event_id=? ' +
            'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="settled" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and runner=? and event_id=? ' +
            'or (A.bet_id=B.bet_id and B.username=C.downlink and C.uplink=D.downlink and D.uplink=E.downlink and state="void" and settled_at between convert_tz(?,"+00:00","-5:30") and convert_tz(?,"+00:00","-5:30")) and event=? and runner=? and event_id=? ' +
            'order by A.settled_at desc'

        pool.query(query, [data.from, data.to, data.event, data.market, data.eventId, data.from, data.to, data.event, data.market, data.eventId, data.from, data.to, data.event, data.market, data.eventId, data.from, data.to, data.event, data.market, data.eventId,], (err, result, fields) => {
            if (err) {
                callback(err)
            } else {
                callback(null, result)
            }
        })
    },
    getRunnerProfitLoss: async (data, callback) => {

        let query = 'select -sum(netProfit) as netProfit ' +
            'from clientbook where runner=? and id in ( select id from clientbookmap where event=? and market=?)'

        pool.query(query, [data.runner, data.event, data.market], (error, results, fields) => {
            if (error)
                callback(error)
            else {
                callback(null, results)
            }
        })
    },
    getFancyBook: async (data, callback) => {

        let query = 'select user_rate,odds,selection,stake ' +
            'from bets ' +
            'where state="matched" and type="fancy" and event_id=? and runner_id=?';

        pool.query(query, [data.event, data.runner], (err, results, fields) => {
            if (err)
                callback(err);
            else {

                for (const bet of results) {
                    if (bet.selection === 'back') {
                        bet.selection = 'lay'
                    } else {
                        bet.selection = 'back'
                    }
                }

                let book = fancybook(results)
                callback(null, book)
            }
        });
    },
    updateBalanceOfAll: (callback) => {

        const query = 'select username from users where usertype="5"'
        pool.query(query, async (err, results, fields) => {
            if (err)
                callback(err);
            else {
                const queries = [], queryValues = []
                for (const user of results) {
                    queries.push('update users set balance=credit_limit-exposure+IF((select sum(profit_loss_wc) from bets where bet_id in(select bet_id from betmap where username=?)),(select sum(profit_loss_wc) from bets where bet_id in(select bet_id from betmap where username=?)),balance-credit_limit+exposure),winnings=IF((select sum(profit_loss_wc) from bets where bet_id in(select bet_id from betmap where username=?)),(select sum(profit_loss_wc) from bets where bet_id in(select bet_id from betmap where username=?)),winnings) where username=?')
                    queryValues.push([user.username, user.username, user.username, user.username, user.username])
                }
                transaction(queries, queryValues, (err, result) => {

                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                    else
                        callback(null, 'updated successfully');
                });
            }
        })
    }
}