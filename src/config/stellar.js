import Stellar from 'stellar-base'

export default class StellarConfig {
  constructor() {
    this.escrowAccount =
      'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ'
    this.asset = {
      evry: {
        name: 'EVRY',
      },
    }
    this.issuer = 'GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5'
    this.network = Stellar.Networks.TESTNET
    Object.seal(this)
  }
}
