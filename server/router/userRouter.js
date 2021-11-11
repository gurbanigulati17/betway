const { doesIExist, doesUserExists, create, deposit, withdraw, myInfo, authCheck, userBalanceInfo, userAccountStatement,
    getUsers, getDownlink, changePassword, resetPassword, limitRisk, allConstarints, getDefautConstraints,
    toggleSuspend, toggleBetSuspend, activity, deleteUser, login, logout, getMatches, getMatchesBySport,
    getMarketsByMatch, matchInfo, getRunnersByMarket, getRunnerProfitLoss, getFancyMaxMin, getCurrentBetsByEvent,
    getMarketAnalysis, limitFancyRisk, createMatchedBet, createFancyBet, getFancyBook, runnerExposure, sportList,
    toggleSport, getStakes, setStakes, betHistory, runningMarketAnanysis, profitLoss, showBetHistory, clientPL,
    fancyStakes, chipSummary, userProfitLoss, settlement, setCommission, getMessage, getExposure, exposureBets,
    userPL, acceptAnyOdds, toggleAcceptAnyOdds, getFancyBetsByEvent, userActivity,
    changeFullname, getInplayMatches, showMarketReport } = require('../users/user/user-controller');

const router = require('express').Router();
const { checkToken } = require('../auth/token_validation');

router.get('/doesIExist', checkToken, doesIExist);  // username
router.get('/doesUserExists/:username', checkToken, doesUserExists);  // username
router.post('/', checkToken, create);  // m_username,passsword,fullname,email,phoneNumber
router.patch('/deposit', checkToken, deposit);  // m_username,money
router.patch('/withdraw', checkToken, withdraw);  // m_username,money
router.get('/info', checkToken, myInfo);
router.get('/authCheck', checkToken, authCheck);
router.get('/userBalanceInfo/:username', checkToken, userBalanceInfo)  //username
//router.patch('/creditRef', checkToken, creditMaster);  // m_username,money
router.get('/userAccountStatement/:type/:username/:usertype/:from/:to', checkToken, userAccountStatement)
router.get('/getUsers/:usertype', checkToken, getUsers)
router.get('/getDownlink/:username', checkToken, getDownlink)
router.put('/changePassword', checkToken, changePassword); //old_password,new_password
router.put('/resetPassword', checkToken, resetPassword); //s_username,new_password
router.put('/limitRisk', checkToken, limitRisk)
router.put('/limitFancyRisk', checkToken, limitFancyRisk)
router.get('/allConstraints/:username/:sport', checkToken, allConstarints)
router.get('/getDefaultConstraints/:username/:sport', checkToken, getDefautConstraints)
router.put('/toggleSuspend', checkToken, toggleSuspend) //username
router.put('/toggleBetSuspend', checkToken, toggleBetSuspend) //username
router.delete('/delete/:username/:password', checkToken, deleteUser)
router.get('/getMatches', checkToken, getMatches)
router.get('/getInplayMatches', checkToken, getInplayMatches)
router.get('/getMatchesBySport/:sport', checkToken, getMatchesBySport)
router.get('/getMarketsByMatch/:matchId', checkToken, getMarketsByMatch)
router.get('/getRunnersByMarket/:marketId', checkToken, getRunnersByMarket)
router.get('/matchInfo/:eventId', matchInfo)
router.get('/getRunnerPL/:event/:market/:runner', checkToken, getRunnerProfitLoss)
router.get('/getFancyMaxMin/:matchId', checkToken, getFancyMaxMin)
router.get('/getCurrentBetsByEvent/:eventId', checkToken, getCurrentBetsByEvent)
router.get('/getFancyBetsByEvent/:eventId', checkToken, getFancyBetsByEvent)
router.get('/getMarketAnalysis/:event/:market/:username/:usertype', checkToken, getMarketAnalysis)
router.post('/matched', checkToken, createMatchedBet);
router.post('/fancy', checkToken, createFancyBet);
router.get('/getFancyBook/:event/:runner', checkToken, getFancyBook)
router.get('/getRunnerExposure/:event/:runner', checkToken, runnerExposure);
router.get('/sportList', checkToken, sportList);
router.get('/toggleSport/:event_type', checkToken, toggleSport);
router.get('/getStakes', checkToken, getStakes)
router.put('/setStakes', checkToken, setStakes)
router.get('/betHistory/:from/:to', checkToken, betHistory)
router.get('/runningMarketAnalysis', checkToken, runningMarketAnanysis)
router.get('/profitLoss/:from/:to/:sport', checkToken, profitLoss)
router.post('/showMarketReport', checkToken, showMarketReport)
router.get('/userProfitLoss/:from/:to/:username/:sport', checkToken, userProfitLoss)
router.post('/showBetHistory', checkToken, showBetHistory)
router.get('/clientPL/:from/:to/:username', checkToken, clientPL)
router.get('/fancyStakes/:from/:to/:username', checkToken, fancyStakes)
router.get('/chipSummary/:username', checkToken, chipSummary)
router.put('/settlement', checkToken, settlement)
router.put('/setCommission', checkToken, setCommission)
router.get('/getMessage', getMessage)
router.get('/getExposure', checkToken, getExposure)
router.get('/getExposureBets/:username', checkToken, exposureBets)
router.get('/getUserPL/:from/:to', checkToken, userPL)
router.get('/acceptAnyOdds', checkToken, acceptAnyOdds)
router.put('/toggleAcceptAnyOdds', checkToken, toggleAcceptAnyOdds)
router.post('/login', login);  //username,password
router.put('/logout', checkToken, logout)
router.get('/activity/:from/:to', checkToken, activity)
router.get('/userActivity/:username/:from/:to', checkToken, userActivity)
router.patch('/changeFullname', checkToken, changeFullname)

module.exports = router;