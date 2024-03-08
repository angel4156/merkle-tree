const walletService = require('../services/wallet')
const dotenv = require('dotenv')
dotenv.config()

const getWallets = async (req, res, next) => {
  const wallets = await walletService.getWallets()
  res.json(wallets)
}

const addWallet = async (req, res, next) => {
  const {
    wallet
  } = req.body
  const wlt = await walletService.addWallet(wallet)
  res.json(wlt)
}

module.exports = {
  getWallets,
  addWallet
}