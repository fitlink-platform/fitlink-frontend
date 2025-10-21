// src/services/ptWalletService.js
import axios from '~/api/axiosClient'

export const getMyWallet = async () => {
  const res = await axios.get('/pt/wallet/my')
  
  return res.data
}
