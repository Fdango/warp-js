import Web3 from 'web3'

export let web3Instance = new Web3()

export const initWeb3Instance = (provider) => {
  web3Instance = new Web3(provider)
}
