const express = require('express')

const router = express.Router()

const walletCtrl = require('../controllers/wallet')

router.post('/', walletCtrl.addWallet)

router.get('/', walletCtrl.getWallets)

module.exports = router