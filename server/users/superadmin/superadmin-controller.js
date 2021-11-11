const { findPassword, changePassword, createAdmin, existingSeries, addSeries, removeSeries,
    toggleMatch, toggleMarket, updateMatch, getMatchesToSettle, getFanciesToSettle, getFancyEvents,
    getMatches, getMarkets, getFancyMarket, toggleFancyMarket, setFancyMaxMarket, setFancyMinMarket,
    setMaxMarket, setMinMarket, getSeriesMatches, setCupRate, getRunners, settleMatch, settleFancy, voidFancy,
    voidMatch, deleteMatch, setFancyTimer, setTimer, currentSeriesInfo, setMessage, getAllMatchesToSettle,
    addMarket, undeclareMatch, undeclareFancy, voidBets, deleteBets, addRunner, addManualMarket,
    deleteMarket, createSuperadmin, getAllBets, getAllMatches, matchInfo, getFancyMaxMin, toggleFancyStatus,
    isBlocked, getEventHistory, showBetHistory, getRunnerProfitLoss, getFancyBook, updateBalanceOfAll, addBookmakerMarket } = require('./superadmin-service')

const client = require('../../config/redisCon');
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken')

module.exports = {
    createAdmin: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        createAdmin(body, (err, results) => {
            if (err) {
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
    login: (req, res) => {

        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }

            if (!results.length) {

                const salt = genSaltSync(10);
                let password = body.password
                body.password = hashSync(body.password, salt);
                createSuperadmin(body, (err, results) => {

                    if (err) {
                        console.log(err);
                        return res.status(501).json({
                            success: false,
                            message: 'some error occured'
                        });
                    } else {

                        let result = 0;
                        result = compareSync(password, results[0].password);

                        if (result) {
                            const jsontoken = sign({ result: results }, process.env.SECRET);
                            res.status(200).json({
                                success: true,
                                message: 'Superadmin created',
                                token: jsontoken,
                            });
                        }
                        else {
                            res.status(200).json({
                                success: false,
                                message: 'Invalid password',
                            });
                        }
                    }
                })
            } else {
                let result = 0;
                result = compareSync(body.password, results[0].password);

                if (result) {
                    const jsontoken = sign({ result: results }, process.env.SECRET);
                    res.status(200).json({
                        success: true,
                        message: 'login successfully',
                        token: jsontoken,
                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    changeAdminPassword: (req, res) => {

        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.old_password, results[0].password);
                if (compareResult) {
                    const salt = genSaltSync(10);
                    new_password = hashSync(body.new_password, salt);
                    changePassword(new_password, (err, result) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                error: err
                            });
                        }
                        else {
                            res.status(201).json({
                                success: true,
                                message: 'Password changed successfully',
                                data: result
                            });
                        }
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    existingSeries: (req, res) => {

        existingSeries(req.params.sport, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    currentSeriesInfo: (req, res) => {

        currentSeriesInfo(req.params.id, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    addSeries: (req, res) => {
        const body = req.body;
        addSeries(body, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    addManualMarket: (req, res) => {

        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {

                    addManualMarket(req.body, (err, results) => {

                        if (err) {
                            console.log(err);
                            return res.status(501).json({
                                success: false,
                                error: err
                            })
                        }
                        else {
                            res.status(200).json({
                                success: true,
                                message: 'Market added successfully'
                            })
                        }
                    });
                }
                else {
                    res.status(201).json({
                        success: false,
                        message: 'Invalid Password',
                    });
                }
            }
        })
    },
    addRunner: (req, res) => {

        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {

                    addRunner(req.body, (err, results) => {

                        if (err) {
                            console.log(err);
                            return res.status(501).json({
                                success: false,
                                error: err
                            })
                        }
                        else {
                            res.status(200).json({
                                success: true,
                                message: results
                            })
                        }
                    });
                }
                else {
                    res.status(201).json({
                        success: false,
                        message: 'Invalid Password',
                    });
                }
            }
        })
    },
    addMarket: (req, res) => {

        addMarket(req.body.id, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: 'Markets updated successfully'
                })
            }
        });
    },
    addBookmakerMarket: (req, res) => {

        addBookmakerMarket(req.body.id, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    deleteMarket: (req, res) => {

        const data = {
            marketId: req.params.marketId,
            eventId: req.params.eventId
        }

        deleteMarket(data, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    removeSeries: (req, res) => {

        removeSeries(req.params.id, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    toggleMatch: (req, res) => {
        const body = req.body;
        toggleMatch(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    toggleMarket: (req, res) => {
        const body = req.body;
        toggleMarket(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    toggleFancyMarket: (req, res) => {
        const body = req.body;
        toggleFancyMarket(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    updateMatch: (req, res) => {
        const body = req.body;
        updateMatch(body, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    getSeriesMatches: (req, res) => {

        getSeriesMatches(req.params.id, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    setCupRate: (req, res) => {
        const body = req.body;
        setCupRate(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err,
                    message: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    getMatches: (req, res) => {

        getMatches(req.params.sport, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    deleteMatch: (req, res) => {

        deleteMatch(req.params.id, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err,
                    message: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    getRunners: (req, res) => {

        getRunners(req.params.marketId, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    getFancyMarket: (req, res) => {

        getFancyMarket(req.params.id, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    getFancyMaxMin: (req, res) => {

        const data = {
            matchId: req.params.matchId
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
    getMatchesToSettle: (req, res) => {
        getMatchesToSettle(req.params.sport, (err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    getAllMatchesToSettle: (req, res) => {
        getAllMatchesToSettle((err, results) => {

            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    getFanciesToSettle: (req, res) => {

        getFanciesToSettle(req.params.event, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    getFancyEvents: (req, res) => {

        getFancyEvents((err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    setFancyMaxMarket: (req, res) => {

        const body = req.body;
        setFancyMaxMarket(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    setFancyMinMarket: (req, res) => {

        const body = req.body;
        setFancyMinMarket(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    result: results
                })
            }
        });
    },
    setMaxMarket: (req, res) => {

        const body = req.body;
        setMaxMarket(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    setMinMarket: (req, res) => {

        const body = req.body;
        setMinMarket(body, (err, results) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    error: err
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: results
                })
            }
        });
    },
    settleFancy: (req, res) => {
        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        event: body.event,
                        runner: body.runner,
                        type: 'settle'
                    }
                    settleFancy(body, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    undeclareFancy: (req, res) => {
        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        event: body.eventId,
                        runner: body.marketId,
                        type: 'undeclare'
                    }
                    undeclareFancy(body, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    voidFancy: (req, res) => {
        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        event: body.event,
                        runner: body.runner,
                        type: 'void'
                    }
                    voidFancy(body, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    settleMatch: (req, res) => {
        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                const key = {
                    eventId: body.eventId,
                    marketId: body.marketId,
                    type: 'settle'
                }
                if (compareResult) {
                    settleMatch(body, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    undeclareMatch: (req, res) => {
        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        eventId: body.eventId,
                        marketId: body.marketId,
                        type: 'undeclare'
                    }
                    undeclareMatch(body, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    voidMatch: (req, res) => {
        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        eventId: body.eventId,
                        marketId: body.marketId,
                        type: 'void'
                    }
                    voidMatch(body, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    voidBets: (req, res) => {

        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        bets: body.bets,
                        type: 'void'
                    }
                    voidBets(body.bets, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password',
                    });
                }
            }
        });
    },
    deleteBets: (req, res) => {

        const body = req.body;
        findPassword((err, results) => {
            if (err) {
                console.log(err);
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.password, results[0].password);
                if (compareResult) {
                    const key = {
                        bets: body.bets,
                        type: 'delete'
                    }
                    deleteBets(body.bets, (err, results) => {
                        if (err) {
                            console.log(err);
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
                    })
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: 'Invalid password'
                    });
                }
            }
        });
    },
    getSeriesBySport: (req, res) => {

        getSeriesBySport(req.params.sport, (err, results) => {
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
    getMatchesBySeries: (req, res) => {

        getMatchesBySeries(req.params.seriesId, (err, results) => {
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
    getAllMatches: (req, res) => {

        getAllMatches((err, results) => {
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

        getMarkets(req.params.matchId, (err, results) => {
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
    getAllBets: (req, res) => {

        getAllBets((err, results) => {
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
    setTimer: (req, res) => {

        const body = req.body
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.a_password, results[0].password)
                if (compareResult) {
                    setTimer(body, (err, results) => {
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
    setFancyTimer: (req, res) => {

        const body = req.body
        findPassword((err, results) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'some error occured'
                });
            }
            else {
                compareResult = compareSync(body.a_password, results[0].password)
                if (compareResult) {
                    setFancyTimer(body, (err, results) => {
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
    setMessage: (req, res) => {

        const body = req.body
        setMessage(body, (err, results) => {
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
                    message: 'Message set successfully'
                });
            }
        });
    },
    isBlocked: (req, res) => {

        const data = {
            eventId: req.params.eventId,
            sessionId: req.params.sessionId
        }
        isBlocked(data, (err, results) => {
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
    toggleFancyStatus: (req, res) => {

        toggleFancyStatus(req.body, (err, results) => {
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
    getEventHistory: (req, res) => {
        const data = {
            sport: req.params.sport,
            from: req.params.from,
            to: req.params.to
        }
        getEventHistory(data, (err, results, total) => {
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
    getRunnerProfitLoss: (req, res) => {
        const data = {
            event: req.params.event,
            market: req.params.market,
            runner: req.params.runner
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
    getFancyBook: (req, res) => {

        const data = {
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
    updateBalanceOfAll: (req, res) => {

        updateBalanceOfAll((err, results) => {
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
    }
}