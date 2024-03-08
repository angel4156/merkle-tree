import axios from 'axios'

import {
  API_URL
} from '../constants/'

const walletApi = {
  getWallets: () => axios.get(`${API_URL}/wallets`),
  addWallet: wallet => axios.post(`${API_URL}/wallets`, {
    wallet
  }),
}

export default walletApi