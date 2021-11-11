const pool = require("./database");

module.exports = {
    getUniqueFancy: (array) => {
        let index, uniqueArray = [];
        const newArray = array.map(fancy => {

            if (fancy.selection === 'back') {
                return {
                    user_rate: fancy.user_rate,
                    profit: fancy.stake * fancy.odds / 100
                }
            }
            else {
                return {
                    user_rate: fancy.user_rate,
                    profit: -fancy.stake * fancy.odds / 100
                }
            }
        });
        // Loop through array values
        for (let i = 0; i < newArray.length; i++) {
            index = uniqueArray.findIndex(fancy => fancy.user_rate === newArray[i].user_rate)
            if (index === -1) {
                uniqueArray.push(newArray[i]);
            }
            else {
                uniqueArray[index].profit += newArray[i].profit;
            }
        }
        return uniqueArray;
    },
    createClientBook: (data, queries, queryValues) => {

        if (!data.betExist) {

            const query1 = 'update users set balance=balance-?,exposure=exposure+? where username=?';
            const query2 = 'insert into clientbookmap (username,event,market) values(?,?,?)';
            const query3 = 'SET @Id = LAST_INSERT_ID()';
            const query4 = 'insert into clientbook values(@Id,?,?)';
            const query5 = 'insert into eventexposure values(@Id,?)';

            queries.push(query1, query2, query3, query4, query5);

            for (let i = 0; i < data.otherRunners.length; i++) {
                queries.push('insert into clientbook values(@Id,?,?)');
            }
            let bet_exposure = data.stake;

            if (data.selection == 'lay') {
                bet_exposure = (data.odds - 1) * data.stake;
            }
            const queryValue1 = [bet_exposure, bet_exposure, data.c_username];
            const queryValue2 = [data.c_username, data.event, data.marketId]
            const queryValue3 = []
            let queryValue4

            if (data.selection === 'back') {
                queryValue4 = [data.runner, data.profit];
            }
            else if (data.selection === 'lay') {
                queryValue4 = [data.runner, data.liability];
            }

            const queryValue5 = [bet_exposure];
            queryValues.push(queryValue1, queryValue2, queryValue3, queryValue4, queryValue5);

            data.otherRunners.forEach(runner => {

                let queryValue

                if (data.selection === 'back') {
                    queryValue = [runner, data.liability]
                }
                else if (data.selection === 'lay') {
                    queryValue = [runner, data.profit]
                }
                queryValues.push(queryValue);
            });

            return
        }
        else {

            const query1 = 'update clientbook set netProfit=netProfit+? where id =(select id from clientbookmap where username=? and event=? and market=?) and runner=?';
            queries.push(query1);
            for (let i = 0; i < data.otherRunners.length; i++) {
                queries.push('update clientbook set netProfit=netProfit+? where id =(select id from clientbookmap where username=? and event=? and market=?) and runner=?');
            }
            const query2 = 'select @newEventExposure:=-min(netProfit) from clientbook where id =(select id from clientbookmap where username=? and event=? and market=?)';
            const query3 = 'select @oldEventExposure:=event_exposure from eventexposure where id =(select id from clientbookmap where username=? and event=? and market=?)';
            const query4 = 'update eventexposure set event_exposure=IF(@newEventExposure<=0,0,@newEventExposure) where id =(select id from clientbookmap where username=? and event=? and market=?)';
            const query5 = 'update users set ' +
                'balance=balance+IF(@newEventExposure<=0,@oldEventExposure,@oldEventExposure-@newEventExposure), ' +
                'exposure=exposure+IF(@newEventExposure<=0,-@oldEventExposure,@newEventExposure-@oldEventExposure) ' +
                'where username=?';

            queries.push(query2, query3, query4, query5);

            let queryValue1;

            if (data.selection === 'back') {
                queryValue1 = [data.profit, data.c_username, data.event, data.marketId, data.runner];
            }
            else if (data.selection === 'lay') {
                queryValue1 = [data.liability, data.c_username, data.event, data.marketId, data.runner];
            }
            queryValues.push(queryValue1);

            data.otherRunners.forEach(runner => {
                if (data.selection === 'back') {
                    queryValues.push([data.liability, data.c_username, data.event, data.marketId, runner]);
                }
                else if (data.selection === 'lay') {
                    queryValues.push([data.profit, data.c_username, data.event, data.marketId, runner]);
                }
            });

            const queryValue2 = [data.c_username, data.event, data.marketId];
            const queryValue3 = [data.c_username, data.event, data.marketId];
            const queryValue4 = [data.c_username, data.event, data.marketId];
            const queryValue5 = [data.c_username];
            queryValues.push(queryValue2, queryValue3, queryValue4, queryValue5);

            return
        }
    },
    createClientBookWithOutRegister: (data, queries, queryValues) => {

        const query1 = 'update clientbook set ' +
            'netProfit=netProfit+? ' +
            'where runner=? and id in(select id from clientbookmap where username=? and event=? and market=?)';
        queries.push(query1);

        for (let i = 0; i < data.otherRunners.length; i++) {
            queries.push('update clientbook set netProfit=netProfit+? where runner=? and id in(select id from clientbookmap where username=? and event=? and market=?)');
        }

        const query2 = 'select @newEventExposure:=-min(netProfit) from clientbook where id in(select id from clientbookmap where username=? and event=? and market=?)';
        const query3 = 'select @oldEventExposure:=event_exposure from eventexposure where id in(select id from clientbookmap where username=? and event=? and market=?)';
        const query4 = 'update eventexposure set event_exposure=IF(@newEventExposure<=0,0,@newEventExposure) where id in(select id from clientbookmap where username=? and event=? and market=?)';
        const query5 = 'update users set ' +
            'balance=balance+IF(@newEventExposure<=0,@oldEventExposure,@oldEventExposure-@newEventExposure), ' +
            'exposure=exposure+IF(@newEventExposure<=0,-@oldEventExposure,@newEventExposure-@oldEventExposure) ' + 'where username=?';
        queries.push(query2, query3, query4, query5);

        let queryValue1;
        if (data.selection === 'back') {
            queryValue1 = [data.profit, data.runner, data.c_username, data.event, data.marketId];
        }
        else if (data.selection === 'lay') {
            queryValue1 = [data.liability, data.runner, data.c_username, data.event, data.marketId];
        }
        queryValues.push(queryValue1);

        data.otherRunners.forEach(runner => {
            if (data.selection === 'back') {
                queryValues.push([data.liability, runner, data.c_username, data.event, data.marketId]);
            }
            else if (data.selection === 'lay') {
                queryValues.push([data.profit, runner, data.c_username, data.event, data.marketId]);
            }
        });
        const queryValue2 = [data.c_username, data.event, data.marketId];
        const queryValue3 = [data.c_username, data.event, data.marketId];
        const queryValue4 = [data.c_username, data.event, data.marketId];
        const queryValue5 = [data.c_username];
        queryValues.push(queryValue2, queryValue3, queryValue4, queryValue5);

        return
    },
    fancybook: (fancyBets) => {

        fancyBets.sort((a, b) => {
            return a.user_rate - b.user_rate
        });

        let sortedFancyBets = getUniqueFancy(fancyBets);
        let fancyBook = [];

        while (fancyBets.length) {

            let fancy = [], prevProfit = 0, flag = false;
            fancy.push(fancyBets[0]);

            while (fancyBets[1] && (fancyBets[1].user_rate === fancyBets[0].user_rate)) {
                fancy.push(fancyBets[1]);
                fancyBets.splice(1, 1);
            }

            fancyBets.splice(0, 1);
            if (sortedFancyBets.findIndex(fancybet => fancybet.user_rate === (fancy[0].user_rate - 1)) === -1) {
                flag = true;
                const newFancy = {
                    user_rate: fancy[0].user_rate - 1,
                    net_profit: 0,
                    color: 'red'
                }
                fancyBook.push(newFancy);
            }
            const newFancy = {
                user_rate: fancy[0].user_rate,
                net_profit: 0,
                color: 'green'
            }
            fancyBook.push(newFancy);

            sortedFancyBets.forEach(runner => {
                if (runner.user_rate < fancy[0].user_rate) {
                    prevProfit = prevProfit + runner.profit
                }
            });

            for (let fancybet of fancy) {
                fancyBook.forEach(cur_fancy => {
                    if (cur_fancy.user_rate < fancybet.user_rate) {
                        if (fancybet.selection === 'back')
                            cur_fancy.net_profit += -fancybet.stake;
                        else
                            cur_fancy.net_profit += fancybet.stake;
                    }
                    else if (cur_fancy.user_rate === fancybet.user_rate) {
                        if (fancybet.selection === 'back')
                            cur_fancy.net_profit += fancybet.stake * fancybet.odds / 100;
                        else
                            cur_fancy.net_profit += -fancybet.stake * fancybet.odds / 100;
                    }
                })
            }

            fancyBook.forEach(newFancy => {
                if ((flag && (newFancy.user_rate === fancy[0].user_rate - 1)) || newFancy.user_rate === fancy[0].user_rate) {
                    newFancy.net_profit += prevProfit;
                }
            })

        }
        return fancyBook
    },
    fancyBetValidation: (data, callback) => {

        const query = 'select balance,bet_suspended,suspended from users where username=?'

        pool.query(query, [data.username], (err, result, fields) => {
            if (err)
                callback(err);
            else {
                if (!result.length) {
                    callback(null, {
                        isValid: false,
                        code: 6
                    })
                    return
                }
                let client = result[0]
                if (client.bet_suspended || client.suspended) {
                    callback(null, {
                        isValid: false,
                        code: 7
                    })
                    return
                }

                if (data.new_exposure < data.old_exposure) {
                    callback(null, {
                        isValid: true
                    })
                    return
                }
                else if (data.max_profit > data.restriction) {
                    callback(null, {
                        isValid: false,
                        code: 8
                    })
                    return
                }
                else if (data.new_exposure - data.old_exposure > client.balance) {
                    callback(null, {
                        isValid: false,
                        code: 5
                    })
                    return
                }
                else {
                    callback(null, {
                        isValid: true
                    })
                    return
                }
            }
        })
    },
    applyCommission: (arr, usertype) => {

        let left = 0, right = 0

        for (const user of arr) {

            switch (usertype) {
                case '1':
                    user.seniorsuper = -user.Profit_Loss
                    left = left + -user.Profit_Loss
                    right = null
                    break;
                case '2':
                    user.admin = -user.Profit_Loss
                    user.supermaster = -user.Profit_Loss
                    left = left + -user.Profit_Loss
                    right = right + -user.Profit_Loss
                    break;
                case '3':
                    user.seniorsuper = -user.Profit_Loss
                    user.master = -user.Profit_Loss
                    left = left + -user.Profit_Loss
                    right = right + -user.Profit_Loss
                    break;
                case '4':
                    user.supermaster = -user.Profit_Loss
                    user.client = user.Profit_Loss_wc
                    left = left + -user.Profit_Loss
                    right = right + user.Profit_Loss_wc
                    break;
                default:
                    break;
            }
        }

        return {
            left: left.toFixed(2),
            right: right ? right.toFixed(2) : null
        }
    },
    eventAndClientInfo: (data, callback) => {

        if (data.manual === 'yes') {

            const query2 = 'select sum(netProfit) as netProfit ' +
                'from clientbook where id =(select id from clientbookmap where event=? and market=? and username=?) and runner=? '

            pool.query(query2, [data.event, data.market, data.c_username, data.runner], (error, result2, fields) => {
                if (error)
                    callback(error)
                else {
                    const query3 = 'select A.exposure,A.balance,A.suspended,A.bet_suspended,C.runner,C.netProfit ' +
                        'from users as A,clientbookmap as B,clientbook as C ' +
                        'where A.username = B.username and B.event=? and A.username=? and B.market=? and B.id=C.id';

                    pool.query(query3, [data.event, data.c_username, data.market], (err, result3, fields) => {
                        if (err)
                            callback(err);
                        else {
                            callback(null, result3, result2[0].netProfit);
                        }
                    });
                }
            })
        } else {
            const query2 = 'select A.exposure,A.balance,A.suspended,A.bet_suspended,C.runner,C.netProfit ' +
                'from users as A,clientbookmap as B,clientbook as C ' +
                'where A.username = B.username and B.event=? and A.username=? and B.market=? and B.id=C.id';

            pool.query(query2, [data.event, data.c_username, data.market], (err, result2, fields) => {
                if (err)
                    callback(err);
                else {
                    callback(null, result2, null);
                }
            });
        }
    },
    calculateNewBetValidation: async (curProfit, odds, selection, stake, inplay, restriction, username) => {

        try {

            const query = 'select balance,suspended,bet_suspended from users where username=?'
            const results = await pool.query(query, [username])

            if (!results.length) {
                return {
                    isValid: false,
                    message: 'Your account has been deleted'
                }
            }
            let client = results[0];

            if (client.bet_suspended) {
                return {
                    isValid: false,
                    message: 'Your account has been suspended! Contact upline'
                }
            }

            if (selection === 'back') {

                if (curProfit && (stake * (odds - 1) + curProfit > 250000)) {
                    return {
                        isValid: false,
                        message: 'Low liquidity'
                    }
                }
                else if (inplay ? stake * (odds - 1) > restriction.max_profit : stake * (odds - 1) > restriction.adv_max_profit) {
                    return {
                        isValid: false,
                        message: 'Maximum profit exceeded'
                    }
                }
                else if (stake > client.balance) {
                    return {
                        isValid: false,
                        message: 'Insufficient Balance'
                    }
                }
                else {
                    return {
                        isValid: true
                    }
                }

            }
            else {

                if (curProfit && (stake + curProfit > 250000)) {
                    return {
                        isValid: false,
                        message: 'Low liquidity'
                    }
                }
                else if (inplay ? stake > restriction.max_profit : stake > restriction.adv_max_profit) {
                    return {
                        isValid: false,
                        message: 'Maximum profit exceeded'
                    }
                }
                else if ((odds - 1) * stake > client.balance) {
                    return {
                        isValid: false,
                        message: 'Insufficient Balance'
                    }
                }
                else {
                    return {
                        isValid: true
                    }
                }
            }
        } catch (err) {
            return {
                isValid: false,
                message: err
            }
        }
    },
    calculateBetValidation: (curProfit, data, runner, odds, selection, stake, inplay, restriction) => {

        if (!data.length) {
            return {
                isValid: false,
                message: 'Your account has been deleted'
            }
        }

        if (data[0].bet_suspended) {
            return {
                isValid: false,
                message: 'Your account has been suspended! Contact upline'
            }
        }

        const balance = data[0].balance;
        const currentNetProfits = data.map(runner => {
            return runner.netProfit
        });
        let min = Math.min.apply(null, currentNetProfits);
        let old_exposure;
        if (min >= 0) {
            old_exposure = 0;
        }
        else {
            old_exposure = -min;
        }
        const runners = data.map(cur_runner => {
            return {
                runner: cur_runner.runner,
                net_profit: cur_runner.netProfit
            }
        });
        const runnersAfterBet = runners.map(cur_runner => {
            if (cur_runner.runner === runner) {

                if (selection === 'back') {
                    return cur_runner.net_profit + (odds - 1) * stake
                }
                else {
                    return cur_runner.net_profit - (odds - 1) * stake
                }
            }
            else {
                if (selection === 'back') {
                    return cur_runner.net_profit - stake
                }
                else {
                    return cur_runner.net_profit + stake
                }
            }
        });

        min = Math.min.apply(null, runnersAfterBet);
        let maxProfit = Math.max.apply(null, runnersAfterBet);
        let new_exposure;

        if (min >= 0) {
            new_exposure = 0;
        }
        else {
            new_exposure = -min;
        }
        if (new_exposure < old_exposure) {
            return {
                isValid: true
            }
        }
        else if (inplay ? maxProfit > restriction.max_profit : maxProfit > restriction.adv_max_profit) {
            return {
                isValid: false,
                message: 'Maximum profit exceeded'
            }
        }
        else if (curProfit && (maxProfit + curProfit > 250000)) {
            return {
                isValid: false,
                message: 'Low liquidity'
            }
        }
        else if (new_exposure - old_exposure > balance) {
            return {
                isValid: false,
                message: 'Insufficient Funds'
            }
        }
        else {
            return {
                isValid: true
            }
        }
    },
    removeDups: (array) => {
        let unique = [];
        array.forEach(function (obj) {

            const index = unique.findIndex(newObj => isEquivalent(obj, newObj))

            if (index === -1) {
                unique.push(obj)
            }
        });
        return unique
    },
    isEquivalent: (a, b) => {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}
function getUniqueFancy(array) {
    let index, uniqueArray = [];
    const newArray = array.map(fancy => {

        if (fancy.selection === 'back') {
            return {
                user_rate: fancy.user_rate,
                profit: fancy.stake * fancy.odds / 100
            };
        }
        else {
            return {
                user_rate: fancy.user_rate,
                profit: -fancy.stake * fancy.odds / 100
            };
        }
    });
    // Loop through array values
    for (let i = 0; i < newArray.length; i++) {
        index = uniqueArray.findIndex(fancy => fancy.user_rate === newArray[i].user_rate);
        if (index === -1) {
            uniqueArray.push(newArray[i]);
        }
        else {
            uniqueArray[index].profit += newArray[i].profit;
        }
    }
    return uniqueArray;
}
const isEquivalent = (a, b) => {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}