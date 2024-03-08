const express = require('express')

const router = express.Router()
const walletRoutes = require('./routes/wallet')

router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/wallets', walletRoutes)

module.exports = router;