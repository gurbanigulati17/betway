const { doesUserExists, create, deposit, withdraw, findUserByUsername, myInfo, authCheck, userBalanceInfo,
    allConstraints, getDefautConstraints, userAccountStatement, getUsers, changePassword, resetPassword,
    limitRisk, isSuspended, isBetSuspended, activity, deleteUser, loginSuccess, loginFailure, logoutFailure,
    logoutSuccess, getDownlink, getMatches, getMatchesBySport, getMarketsByMatch, getRunnersByMarket, matchInfo,
    getRunnerProfitLoss, getFancyMaxMin, getCurrentBetsByEvent, getMarketAnanlysis, limitFancyRisk, createMatched,
    createFancy, getFancyBook, runnerExposure, sportList, toggleSport, getStakes, setStakes, betHistory,
    runningMarketAnanlysis, profitLoss, showBetHistory, clientPL, fancyStakes, chipSummary, settlement,
    setCommission, toggleBetSuspend, toggleSuspend, getExposure, getMessage, exposureBets, userPL, acceptAnyOdds,
    toggleAcceptAnyOdds, getFancyBetsByEvent, changeFullname, getInplayMatches, showMarketReport } = require('./user-service');

const client = require('../../config/redisCon');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');

module.exports = {
    doesIExist: (req, res) => {

        doesUserExists(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })
    },
    doesUserExists: (req, res) => {

        doesUserExists(req.params.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })
    },
    create: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        body.my_username = req.decoded.result.username
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    deposit: (req, res) => {
        const body = req.body;

        findUserByUsername(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            if (!results.length) {
                return res.status(201).json({
                    success: false,
                    message: 'User not recognized'
                });
            }

            const result = compareSync(body.password, results[0].password);
            if (result) {

                if (body.money <= 0) {
                    return res.status(201).json({
                        success: false,
                        message: 'Please enter a valid amount'
                    });
                }
                body.username = req.decoded.result.username
                const key = {
                    uplink: body.uplink,
                    downlink: body.downlink,
                    uplink_type: body.uplink_type,
                    downlink_type: body.downlink_type,
                    money: body.money
                }
                deposit(body, (err, results) => {
                    if (err) {
                        console.log(err)
                        client.del(JSON.stringify(key), (error, reply) => {
                            if (error)
                                return res.status(501).json({
                                    success: false,
                                    message: error
                                });

                            return res.status(501).json({
                                success: false,
                                message: err
                            });
                        })
                    }
                    else {
                        client.del(JSON.stringify(key), (error, reply) => {
                            if (error)
                                return res.status(501).json({
                                    success: false,
                                    message: error
                                });

                            res.status(201).json({
                                success: true,
                                message: results
                            });
                        })
                    }
                });

            }
            else {
                res.status(201).json({
                    success: false,
                    message: 'Invalid Password'
                })
            }
        })
    },
    withdraw: (req, res) => {
        const body = req.body;

        findUserByUsername(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            if (!results.length) {
                return res.status(201).json({
                    success: false,
                    message: 'User not recognized'
                });
            }

            const result = compareSync(body.password, results[0].password);
            if (result) {
                if (body.money > body.balance) {
                    return res.status(201).json({
                        success: false,
                        message: "Free chips can't be greater than child balance"
                    });
                }
                body.username = req.decoded.result.username
                const key = {
                    uplink: body.uplink,
                    downlink: body.downlink,
                    uplink_type: body.uplink_type,
                    downlink_type: body.downlink_type,
                    money: body.money
                }
                withdraw(body, (err, results) => {
                    if (err) {
                        console.log(err)
                        client.del(JSON.stringify(key), (error, reply) => {
                            if (error)
                                return res.status(501).json({
                                    success: false,
                                    message: error
                                });

                            return res.status(501).json({
                                success: false,
                                message: err
                            });
                        })
                    }
                    else {
                        client.del(JSON.stringify(key), (error, reply) => {
                            if (error)
                                return res.status(501).json({
                                    success: false,
                                    message: error
                                });

                            res.status(201).json({
                                success: true,
                                message: results
                            });
                        })
                    }
                });
            }
            else {
                res.status(201).json({
                    success: false,
                    message: 'Invalid Password'
                })
            }
        })
    },
    myInfo: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            time: req.decoded.result.time,
            expiresIn: req.decoded.result.expiresIn
        }

        myInfo(data, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })
    },
    authCheck: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            time: req.decoded.result.time,
            expiresIn: req.decoded.result.expiresIn
        }

        authCheck(data, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })
    },
    userBalanceInfo: (req, res) => {

        userBalanceInfo(req.params.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })
    },
    userAccountStatement: (req, res) => {
        const data = {
            type: req.params.type,
            username: req.params.username,
            usertype: req.params.usertype,
            from: req.params.from,
            to: req.params.to
        }
        userAccountStatement(data, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getUsers: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            usertype: req.params.usertype
        }

        getUsers(data, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getDownlink: (req, res) => {

        const data = {
            my_username: req.decoded.result.username,
            username: req.params.username
        }

        getDownlink(data, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                if (!results) {
                    res.status(201).json({
                        success: true,
                        data: false,
                        message: 'You are not authorized to see ' + req.params.username + "'s child"
                    });
                } else {
                    res.status(201).json({
                        success: true,
                        data: results
                    });
                }
            }
        });
    },
    changePassword: (req, res) => {

        const body = req.body;

        findUserByUsername(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            if (!results.length) {
                res.status(501).json({
                    success: false,
                    message: 'Username not found'
                });
            }

            const result = compareSync(body.old_password, results[0].password);
            if (result) {
                const salt = genSaltSync(10);
                const new_password = hashSync(body.new_password, salt);
                const dataPacket = {
                    new_password: new_password,
                    username: req.decoded.result.username
                };
                changePassword(dataPacket, (err, results) => {
                    if (err) {
                        console.log(err)
                        return res.status(501).json({
                            success: false,
                            message: 'some error occured'
                        });
                    }
                    else {
                        if (results) {
                            return res.status(201).json({
                                success: true,
                                changePassword: true,
                                message: 'Password changed successfully'
                            });
                        }
                        else {
                            return res.status(201).json({
                                success: true,
                                changePassword: false,
                                message: 'Your account has been suspended! Contact upline'
                            });
                        }
                    }
                });
            }
            else {
                res.status(200).json({
                    success: false,
                    message: 'Invalid password'
                });
            }
        })
    },
    resetPassword: (req, res) => {

        const body = req.body;

        findUserByUsername(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            if (!results.length) {
                return res.status(201).json({
                    success: false,
                    message: 'Seniorsuper not recognized'
                });
            }

            const result = compareSync(body.password, results[0].password)
            if (result) {
                const salt = genSaltSync(10)
                body.new_password = hashSync(body.new_password, salt)
                body.my_username = req.decoded.result.username
                resetPassword(body, (err, results) => {
                    if (err) {
                        console.log(err)
                        return res.status(501).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        res.status(201).json({
                            success: true,
                            message: results,
                        });
                    }
                });
            }
            else {
                res.status(201).json({
                    success: false,
                    message: 'Invalid Password'
                })
            }
        })
    },
    limitRisk: (req, res) => {

        const body = req.body;
        body.my_username = req.decoded.result.username

        limitRisk(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    message: results,
                })
            }
        })

    },
    limitFancyRisk: (req, res) => {

        const body = req.body;
        body.my_username = req.decoded.result.username

        limitFancyRisk(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    message: results,
                })
            }
        })

    },
    allConstarints: (req, res) => {

        const data = {
            username: req.params.username,
            event_type: req.params.sport
        }

        allConstraints(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })

    },
    getDefautConstraints: (req, res) => {

        const data = {
            username: req.params.username,
            my_username: req.decoded.result.username,
            event_type: req.params.sport
        }

        getDefautConstraints(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                });
            }
            else {

                if (results) {

                    return res.status(201).json({
                        success: true,
                        data: results
                    })
                } else {

                    return res.status(201).json({
                        success: false,
                        message: 'unauthorized request'
                    })
                }
            }
        })

    },
    toggleSuspend: (req, res) => {

        const body = req.body;
        isSuspended(req.decoded.result.username, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                if (result) {
                    return res.status(200).json({
                        success: false,
                        message: 'Sorry your account has been suspended! Contact upline'
                    })
                } else {
                    toggleSuspend(body.username, (err, results) => {

                        if (err) {
                            console.log(err)
                            return res.status(501).json({
                                success: false,
                                error: err
                            })
                        }
                        else {
                            res.status(200).json({
                                success: true,
                                message: results === 1 ? 'Unsuspended successfully' : 'Suspended successfully'
                            })
                        }
                    });
                }
            }
        })
    },
    toggleBetSuspend: (req, res) => {

        const body = req.body;
        isBetSuspended(req.decoded.result.username, (err, result) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                if (result) {
                    return res.status(200).json({
                        success: false,
                        message: 'You can not take this action!'
                    })
                }
                else {
                    toggleBetSuspend(body.username, (err, results) => {

                        if (err) {
                            console.log(err)
                            return res.status(501).json({
                                success: false,
                                error: err
                            })
                        }
                        else {
                            res.status(200).json({
                                success: true,
                                message: results === 1 ? 'Unsuspended successfully' : 'Suspended successfully'
                            })
                        }
                    });
                }
            }
        })
    },
    deleteUser: (req, res) => {

        if (req.decoded.result.username.toLowerCase() !== 'admin') {
            return res.status(200).json({
                success: false,
                message: 'You are not authorized to do this action!'
            });
        }

        findUserByUsername(req.decoded.result.username, (err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(req.params.password, results[0].password);
                if (compareResult) {

                    deleteUser(req.params.username, (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.status(501).json({
                                success: false,
                                message: err
                            });
                        }
                        else {
                            res.status(201).json({
                                success: true,
                                message: results
                            })
                        }
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password'
                    });
                }
            }
        })
    },
    getMatches: (req, res) => {

        getMatches((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })

    },
    getInplayMatches: (req, res) => {

        getInplayMatches((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })

    },
    getMatchesBySport: (req, res) => {

        getMatchesBySport(req.params.sport, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                })
            }
        })

    },
    getMarketsByMatch: (req, res) => {

        const data = {
            matchId: req.params.matchId,
            username: req.decoded.result.username
        }

        getMarketsByMatch(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getRunnersByMarket: (req, res) => {

        getRunnersByMarket(req.params.marketId, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    matchInfo: (req, res) => {

        matchInfo(req.params.eventId, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getRunnerProfitLoss: (req, res) => {
        const data = {
            event: req.params.event,
            market: req.params.market,
            runner: req.params.runner,
            username: req.decoded.result.username
        }
        getRunnerProfitLoss(data, (err, results, usertype) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results,
                    usertype: usertype
                });
            }
        });
    },
    getFancyMaxMin: (req, res) => {

        const data = {
            matchId: req.params.matchId,
            username: req.decoded.result.username,
            event_type: '5'
        }

        getFancyMaxMin(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getMarketAnalysis: (req, res) => {

        const data = {
            event: req.params.event,
            market: req.params.market,
            username: req.params.username,
            usertype: req.params.usertype
        }
        getMarketAnanlysis(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    createMatchedBet: (req, res) => {

        const body = req.body;
        body.c_username = req.decoded.result.username
        createMatched(body, (err, message, success) => {

            if (err) {
                console.log(err);
                client.del(body.c_username, (error, reply) => {
                    if (error)
                        return res.status(501).json({
                            success: false,
                            message: error
                        });

                    return res.status(501).json({
                        success: false,
                        message: err
                    });
                })
            }
            else {
                client.del(body.c_username, (error, reply) => {
                    if (error)
                        return res.status(501).json({
                            success: false,
                            message: error
                        });

                    res.status(201).json({
                        success: success,
                        message: message
                    });

                })
            }
        });
    },
    createFancyBet: (req, res) => {
        const body = req.body;
        body.c_username = req.decoded.result.username
        createFancy(body, (err, results) => {
            if (err) {
                console.log(err);
                client.del(body.c_username, (error, reply) => {
                    if (error)
                        return res.status(501).json({
                            success: false,
                            message: error
                        });

                    return res.status(501).json({
                        success: false,
                        message: err
                    });
                })
            }
            else {

                client.del(body.c_username, (error, reply) => {
                    if (error)
                        return res.status(501).json({
                            success: false,
                            message: error
                        });

                    if (results === 1) {
                        res.status(201).json({
                            success: true,
                            message: 'Bet placed successfully'
                        });
                    }
                    else if (results === 0) {
                        res.status(201).json({
                            success: false,
                            message: 'Sorry market is closed'
                        });
                    }
                    else if (results === 2) {
                        res.status(201).json({
                            success: false,
                            message: "You can't bet on this match"
                        });
                    }
                    else if (results === 3) {
                        res.status(201).json({
                            success: false,
                            message: 'Bet not placed because odds changed'
                        });
                    }
                    else if (results === 4) {
                        res.status(201).json({
                            success: false,
                            message: "Min/Max stake constraint violated"
                        });
                    }
                    else if (results === 5) {
                        res.status(201).json({
                            success: false,
                            message: "Insufficient balance"
                        });
                    }
                    else if (results === 6) {
                        res.status(201).json({
                            success: false,
                            message: "Your account has been deleted"
                        });
                    }
                    else if (results === 7) {
                        res.status(201).json({
                            success: false,
                            message: "Your account has been suspended! Contact upline"
                        });
                    }
                    else if (results === 8) {
                        res.status(201).json({
                            success: false,
                            message: "Win limit exceeded"
                        });
                    }
                    else if (results === 9) {
                        res.status(201).json({
                            success: false,
                            message: 'Bet not placed because odds not reliable'
                        });
                    }
                })
            }
        });
    },
    getFancyBook: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            event: req.params.event,
            runner: req.params.runner
        }

        getFancyBook(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        })
    },
    runnerExposure: (req, res) => {
        const data = {
            username: req.decoded.result.username,
            event: req.params.event,
            runner: req.params.runner
        }
        runnerExposure(data, (err, results, usertype) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results,
                    usertype: usertype
                });
            }
        });
    },
    sportList: (req, res) => {

        sportList(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    toggleSport: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            event_type: req.params.event_type
        }

        toggleSport(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {

                if (results === 1) {
                    return res.status(201).json({
                        success: true,
                        message: 'Status updated successfully'
                    });
                } else if (results === 0) {
                    return res.status(201).json({
                        success: false,
                        message: 'U can not take this action'
                    });

                }
            }
        });
    },
    profitLoss: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            sport: req.params.sport,
            from: req.params.from,
            to: req.params.to
        }

        profitLoss(data, (err, results, total) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results,
                    total: total
                });
            }
        });
    },
    showMarketReport: (req, res) => {

        const body = req.body

        showMarketReport(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    userProfitLoss: (req, res) => {

        const data = {
            username: req.params.username,
            sport: req.params.sport,
            from: req.params.from,
            to: req.params.to
        }

        profitLoss(data, (err, results, total) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results,
                    total: total
                });
            }
        });
    },
    getCurrentBetsByEvent: (req, res) => {
        const data = {
            username: req.decoded.result.username,
            eventId: req.params.eventId
        }
        getCurrentBetsByEvent(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getFancyBetsByEvent: (req, res) => {
        const data = {
            username: req.decoded.result.username,
            eventId: req.params.eventId
        }
        getFancyBetsByEvent(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getStakes: (req, res) => {
        getStakes(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    setStakes: (req, res) => {

        const body = req.body
        body.username = req.decoded.result.username
        setStakes(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    message: 'Stake values set successfully'
                });
            }
        });
    },
    betHistory: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            from: req.params.from,
            to: req.params.to
        }

        betHistory(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    runningMarketAnanysis: (req, res) => {

        const data = {
            username: req.decoded.result.username
        }

        runningMarketAnanlysis(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    showBetHistory: (req, res) => {

        const body = req.body

        showBetHistory(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    clientPL: (req, res) => {

        const data = {
            username: req.params.username,
            from: req.params.from,
            to: req.params.to
        }

        clientPL(data, (err, results, left, right) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results,
                    left: left,
                    right: right
                });
            }
        });
    },
    fancyStakes: (req, res) => {

        const data = {
            username: req.params.username,
            from: req.params.from,
            to: req.params.to
        }

        fancyStakes(data, (err, results, total) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results,
                    total: total
                });
            }
        });
    },
    chipSummary: (req, res) => {

        const data = {
            username: req.params.username
        }

        chipSummary(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    settlement: (req, res) => {

        const data = req.body

        settlement(data, (err, results, total) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                if (results === 0) {
                    return res.status(201).json({
                        success: false,
                        message: 'Insufficient balance'
                    });
                } else if (results === 1) {
                    return res.status(201).json({
                        success: false,
                        message: 'Invalid settlement'
                    });
                } else if (results === 2) {
                    return res.status(201).json({
                        success: true,
                        message: 'Settled successfully'
                    });
                }
            }
        });
    },
    setCommission: (req, res) => {

        const data = req.body

        setCommission(data, (err, results, success) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: success,
                    message: results
                });
            }
        });
    },
    getExposure: (req, res) => {

        getExposure(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    getMessage: (req, res) => {

        getMessage((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    message: results
                });
            }
        });
    },
    exposureBets: (req, res) => {

        const data = {
            username: req.params.username
        }

        exposureBets(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    userPL: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            from: req.params.from,
            to: req.params.to
        }

        userPL(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    acceptAnyOdds: (req, res) => {

        acceptAnyOdds(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    toggleAcceptAnyOdds: (req, res) => {

        toggleAcceptAnyOdds(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    login: (req, res) => {

        const body = req.body;

        findUserByUsername(body.username, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            if (!results.length) {
                return res.status(201).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }
            if (results[0].suspended) {
                return res.status(201).json({
                    success: false,
                    message: 'Your account has been suspended'
                });
            }
            else {
                const result = compareSync(body.password, results[0].password);
                if (result) {

                    const time = new Date()
                    const data = {
                        expiresIn: 7200,
                        username: body.username,
                        password: body.password,
                        time: time
                    }
                    const jsontoken = sign({ result: data }, process.env.SECRET, { expiresIn: '2h' });
                    body.token = jsontoken
                    body.time = time
                    loginSuccess(body, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(501).json({
                                success: false,
                                err: err
                            });
                        }
                        else {
                            return res.status(201).json({
                                success: true,
                                message: 'login successfully',
                                token: jsontoken,
                                usertype: body.username === 'admin' ? '1' : results[0].usertype,
                                expiresIn: 7200
                            });
                        }
                    });
                }
                else {
                    const time = new Date()
                    body.time = time
                    loginFailure(body, (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.status(501).json({
                                success: false,
                                err: err
                            });
                        }
                        else {
                            return res.status(201).json({
                                success: false,
                                message: 'Invalid username or password'
                            });
                        }
                    });
                }
            }
        });
    },
    logout: (req, res) => {

        logoutSuccess(req.decoded.result.username, req.body.client_ip, (err, results) => {
            if (err) {
                console.log(err);
                logoutFailure(req.decoded.result.username, req.body.client_ip, (err, results) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        return res.status(201).json({
                            success: false,
                            message: 'Logout failed'
                        });
                    }
                })
            }
            else {
                return res.status(201).json({
                    success: true,
                    message: 'Logout Successful'
                });
            }
        });
    },
    activity: (req, res) => {

        const data = {
            username: req.decoded.result.username,
            from: req.params.from,
            to: req.params.to
        }
        activity(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    userActivity: (req, res) => {

        const data = {
            username: req.params.username,
            from: req.params.from,
            to: req.params.to
        }
        activity(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.status(201).json({
                    success: true,
                    data: results
                });
            }
        });
    },
    changeFullname: (req, res) => {

        const body = req.body

        findUserByUsername(req.decoded.result.username, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            if (!results.length) {
                return res.status(201).json({
                    success: false,
                    message: 'User not recognized'
                });
            }

            const result = compareSync(body.password, results[0].password);
            if (result) {

                changeFullname(body, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(501).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        return res.status(201).json({
                            success: true,
                            message: results
                        });
                    }
                });

            }
            else {
                res.status(201).json({
                    success: false,
                    message: 'Invalid Password'
                })
            }
        })
    }
}