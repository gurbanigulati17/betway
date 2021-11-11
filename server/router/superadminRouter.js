const { changeAdminPassword, createAdmin, login, addSeries, existingSeries, removeSeries, toggleMatch,
    toggleMarket, updateMatch, getMatchesToSettle, getFancyEvents, getFanciesToSettle, getMatches,
    getFancyMarket, toggleFancyMarket, setMaxMarket, setMinMarket, setFancyMaxMarket,
    setFancyMinMarket, getSeriesMatches, setCupRate, getRunners, settleMatch, settleFancy, voidMatch,
    voidFancy, deleteMatch, setTimer, setFancyTimer, setMessage, currentSeriesInfo, getAllMatchesToSettle,
    voidBets, addManualMarket, addRunner, addMarket, deleteMarket, undeclareMatch, undeclareFancy,
    getAllBets, getAllMatches, getMarketsByMatch, matchInfo, getFancyMaxMin, isBlocked, toggleFancyStatus, 
    getEventHistory, showBetHistory, getRunnerProfitLoss, getFancyBook, updateBalanceOfAll, deleteBets,
    addBookmakerMarket } = require('../users/superadmin/superadmin-controller');

const router = require('express').Router();
const { checkTokenSuperAdmin } = require('../auth/token_validation');

router.post('/register', createAdmin);  // passsword
router.put('/changePassword', checkTokenSuperAdmin, changeAdminPassword)  //old_password,new_password
router.get('/existingSeries/:sport', checkTokenSuperAdmin, existingSeries);
router.get('/curSeriesInfo/:id', checkTokenSuperAdmin, currentSeriesInfo); //id
router.post('/addSeries', checkTokenSuperAdmin, addSeries); //id,sport,name,competitionRegion
router.post('/addManualMarket', checkTokenSuperAdmin, addManualMarket);
router.post('/addRunner', checkTokenSuperAdmin, addRunner);
router.post('/addMarket', checkTokenSuperAdmin, addMarket);
router.post('/addBookmakerMarket', checkTokenSuperAdmin, addBookmakerMarket);
router.delete('/deleteMarket/:marketId/:eventId', checkTokenSuperAdmin, deleteMarket);
router.delete('/removeSeries/:id', checkTokenSuperAdmin, removeSeries);
router.get('/getSeriesMatches/:id', checkTokenSuperAdmin, getSeriesMatches);
router.put('/setCupRate', checkTokenSuperAdmin, setCupRate);  //id,cupRate
router.get('/getMatches/:sport', checkTokenSuperAdmin, getMatches);
router.get('/getMarketsByMatch/:matchId', checkTokenSuperAdmin, getMarketsByMatch);
router.get('/getRunners/:marketId', checkTokenSuperAdmin, getRunners); //id
router.get('/getFancyMarket/:id', checkTokenSuperAdmin, getFancyMarket);
router.get('/getFancyMaxMin/:matchId', checkTokenSuperAdmin, getFancyMaxMin)
router.get('/matchInfo/:eventId', matchInfo)
router.put('/toggleMatch', checkTokenSuperAdmin, toggleMatch); //id
router.put('/updateMatch', checkTokenSuperAdmin, updateMatch); //id
router.put('/toggleMarket', checkTokenSuperAdmin, toggleMarket); //id
router.put('/toggleFancyMarket', checkTokenSuperAdmin, toggleFancyMarket); //id
router.get('/getMatchesToSettle/:sport', checkTokenSuperAdmin, getMatchesToSettle);
router.get('/getAllMatchesToSettle', checkTokenSuperAdmin, getAllMatchesToSettle);
router.get('/getFancyEvents', checkTokenSuperAdmin, getFancyEvents);
router.get('/getFanciesToSettle/:event', checkTokenSuperAdmin, getFanciesToSettle);
router.get('/getAllMatches', checkTokenSuperAdmin, getAllMatches);
router.delete('/deleteMatch/:id', checkTokenSuperAdmin, deleteMatch); // username
router.post('/setMaxMarket', checkTokenSuperAdmin, setMaxMarket); //id,max
router.post('/setMinMarket', checkTokenSuperAdmin, setMinMarket); //id,min
router.put('/settleMatch', checkTokenSuperAdmin, settleMatch); //eventId,marketId,winner,password,eventName,runnerName
router.put('/undeclareMatch', checkTokenSuperAdmin, undeclareMatch); //eventId,market,type
router.put('/voidMatch', checkTokenSuperAdmin, voidMatch); //eventId,marketId,password,eventName,runnerName
router.put('/voidBets', checkTokenSuperAdmin, voidBets); //betIds,password
router.put('/deleteBets', checkTokenSuperAdmin, deleteBets); //betIds,password
router.put('/settleFancy', checkTokenSuperAdmin, settleFancy); //eventId,runnerId,winner,password
router.put('/undeclareFancy', checkTokenSuperAdmin, undeclareFancy); //eventId,market,type
router.put('/voidFancy', checkTokenSuperAdmin, voidFancy); //eventId,runnerId,password
router.post('/setFancyMaxMarket', checkTokenSuperAdmin, setFancyMaxMarket); //id,max
router.post('/setFancyMinMarket', checkTokenSuperAdmin, setFancyMinMarket); //id,min
router.get('/getAllBets', checkTokenSuperAdmin, getAllBets);
router.put('/setTimer', checkTokenSuperAdmin, setTimer) //matchId,timer,a_pasword
router.put('/setFancyTimer', checkTokenSuperAdmin, setFancyTimer) //matchId,timer,a_pasword
router.post('/setMessage', checkTokenSuperAdmin, setMessage) //message
router.get('/isBlocked/:eventId/:sessionId', checkTokenSuperAdmin, isBlocked)
router.put('/toggleFancyStatus', checkTokenSuperAdmin, toggleFancyStatus)
router.get('/getEventHistory/:sport/:from/:to', checkTokenSuperAdmin, getEventHistory);
router.post('/showBetHistory', checkTokenSuperAdmin, showBetHistory)
router.get('/getRunnerPL/:event/:market/:runner', checkTokenSuperAdmin, getRunnerProfitLoss)
router.get('/getFancyBook/:event/:runner', checkTokenSuperAdmin, getFancyBook)
router.get('/updateBalanceOfAll', updateBalanceOfAll)
router.post('/login', login)  //password

module.exports = router;