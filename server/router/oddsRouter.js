const router = require('express').Router();
const axios = require('axios');

router.get('/getSports', (req, res) => {
    axios.get('http://142.93.36.1/api/v1/fetch_data?Action=listEventTypes')
        .then(response => {
            return res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error: error
            })
        });
})
router.get('/getSeries/:id', (req, res) => {
    axios.get('http://142.93.36.1/api/v1/fetch_data?Action=listCompetitions&EventTypeID=' + req.params.id)
        .then(response => {
            return res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error: error
            })
        });
})
router.get('/getMatches/:eventId/:id', (req, res) => {
    axios.get('http://142.93.36.1/api/v1/fetch_data?Action=listEvents&EventTypeID=' + req.params.eventId + '&CompetitionID=' + req.params.id)
        .then(response => {
            res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error: error
            })
        });
})
router.get('/getRunners/:marketId', (req, res) => {
    axios.get('http://142.93.36.1/api/v1/fetch_data?Action=listMarketRunner&MarketID=' + req.params.marketId)
        .then(response => {
            return res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error: error
            })
        });
})
router.get('/getMarkets/:eventId', (req, res) => {
    axios.get('http://142.93.36.1/api/v1/fetch_data?Action=listMarketTypes&EventID=' + req.params.eventId)
        .then(response => {
            return res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error: error
            })
        });
})
router.get('/getOdds/:marketId', async (req, res) => {

    const marketIds = req.params.marketId
    const allMarketIds = marketIds.split(",")
    allMarketIds.splice(allMarketIds.length, 1)
    const noOfMarkets = allMarketIds.length

    if (noOfMarkets <= 29) {
        axios.get('http://142.93.36.1/api/v1/listMarketBookOdds?market_id=' + req.params.marketId)
            .then(response => {
                return res.status(200).json({
                    success: true,
                    data: response.data
                })
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    error: error
                })
            });
    }
    else {

        let result = []

        for (let i = 0; i <= noOfMarkets; i = i + 29) {

            let sliced
            if (!Math.floor((allMarketIds.length - i) / 29)) {
                sliced = allMarketIds.slice(i, allMarketIds.length).toString()
            } else {
                sliced = allMarketIds.slice(i, i + 29).toString()
            }
            try {
                const response = await axios.get('http://142.93.36.1/api/v1/listMarketBookOdds?market_id=' + sliced)
                result = result.concat(response.data)
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    error: err
                })
            }
        }
        return res.status(200).json({
            success: true,
            data: result
        })
    }

})
router.get('/getSession/:matchId', (req, res) => {

    axios.get('http://142.93.36.1/api/v1/listMarketBookSession?match_id=' + req.params.matchId)
        .then(response => {

            return res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            return res.status(200).json({
                success: false,
                data: []
            })
        });
})
router.get('/getScore/:matchId', (req, res) => {

    axios.get(' http://142.93.36.1/api/v1/score?match_id=' + req.params.matchId)
        .then(response => {

            return res.status(200).json({
                success: true,
                data: response.data
            })
        })
        .catch(error => {
            console.log(error);
            return res.status(200).json({
                success: false,
                data: []
            })
        });
})
module.exports = router;