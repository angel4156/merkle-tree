const Wallet = require('../models/wallet')

const getWallets = async () => {
  const wallets = await Wallet.find()
  return wallets
}

const addWallet = async wallet => {
  let wlt = new Wallet({
    wallet
  })
  let wltRes = await wlt.save()
  return wltRes._doc
}

module.exports = {
  getWallets,
  addWallet
}