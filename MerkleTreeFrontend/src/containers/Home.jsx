import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Web3 from 'web3'
import keccak256 from 'keccak256'

import HomeComponent from '../components/Home'

import agent from '../api/'

import {
  showToast
} from '../actions/common'

import merkleTreeABI from '../constants/abi'
import { chainConfig, contractAddr } from '../constants'

import MerkleTree from '../helpers/MerkleTree'

let web3, merkleTreeContract

const verify = (val, proof) => {
  let cur = keccak256(val)
  proof.map(proofelement => {
    if (Buffer.compare(proofelement, keccak256('0')) === 0) {
      console.log("zero hash")
    } else if (Buffer.compare(cur, proofelement) == 1) {
      cur = keccak256(Buffer.concat([Buffer.from(proofelement.subarray(0, 20)), Buffer.from(cur.subarray(0, 20))]))
    } else {
      cur = keccak256(Buffer.concat([Buffer.from(cur.subarray(0, 20)), Buffer.from(proofelement.subarray(0, 20))]))
    }
  })
  return cur
}

const Home = () => {
  const [wallet, setWallet] = useState('')
  const [wallets, setWallets] = useState([])
  const [owner, setOwner] = useState('')
  const [addingWallet, setAddingWallet] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const dispatch = useDispatch()
  useEffect(async () => {
    const wlts = (await agent.wallet.getWallets()).data
    console.log('wallet data:', wlts)
    setWallets([...wlts])
    web3 = new Web3(Web3.givenProvider)
    const chainId = await web3.eth.getChainId()
    console.log('current chainid:', chainId)
    if (chainId != chainConfig.chainId) {
      try {
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }]
        });
      } catch (error) {
        alert(error.message);
      }
      window.location.reload()
    }
    merkleTreeContract = new web3.eth.Contract(merkleTreeABI, contractAddr)
    setOwner(await merkleTreeContract.methods.owner().call())
  }, [])
  const onAdd = async () => {
    const newWallet = (await agent.wallet.addWallet(addingWallet)).data
    console.log('added wallet:', newWallet)
    let newWallets = [...wallets, newWallet]
    setWallets([...newWallets])
    setAddingWallet('')
    /*
    var tree = new MerkleTree(newWallets);
    try {
      await merkleTreeContract.methods.setRoot(tree.root).send({ from: wallet }).on('confirmation', (confirmationNumber, receipt) => {
        return dispatch(showToast('Set Root', 'Success'))
      })
    } catch (err) {
      console.log('error setting root:', err)
    }
    */
  }
  const connectWallet = async () => {
    console.log('provider:', Web3.givenProvider)
    web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    console.log('accounts:', accounts)
    setWallet(accounts[0])
  }
  const getTime = async () => {
    if (!wallet) {
      return dispatch(showToast('Get Time Fail', 'Connect your wallet'))
    }
    const walletAddresses = wallets.map(wallet => wallet.wallet)
    console.log('wallet Addreses:', walletAddresses)
    var tree = new MerkleTree(walletAddresses);
    console.log('tree root:', tree.root.toString('hex'))
    const proof = tree.getProof(wallet)
    console.log('Proof:', proof.map(prove => prove.toString('hex')))
    const rawVerifyRes = verify(wallet, proof)
    console.log('Client Verify:', rawVerifyRes.toString('hex'))
    const hexProof = tree.getHexProof(wallet)
    console.log('HexProof:', hexProof)
    console.log("my wallet hash:",)

    // const verifyRes = await merkleTreeContract.methods.verify(hexProof, `0x${tree.root.toString('hex')}`, wallet).call({ from: wallet })
    // console.log('verify res:', verifyRes)
    try {
      const time = await merkleTreeContract.methods.getTime(hexProof, `0x${tree.root.toString('hex')}`).call({ from: wallet })
      setCurrentTime(time)
    } catch (err) {
      console.log('error:', { err })
      return dispatch(showToast('Get Time Fail', 'You are not on whitelist'))
    }
  }
  console.log(owner, wallet)
  return <HomeComponent wallets={wallets} addingWallet={addingWallet} setAddingWallet={setAddingWallet} onAdd={onAdd} wallet={wallet} connectWallet={connectWallet} getTime={getTime} owner={owner} currentTime={currentTime} />
}

export default Home