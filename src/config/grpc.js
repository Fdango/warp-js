export default class GRPCConfig {
  constructor() {
    this.proto = {
      stellar: {
        name: 'stellar',
      },
      evrynet: {
        name: 'evrynet',
      },
      transfer: {
        name: 'transfer',
      },
    }
    this.host = 'http://localhost:9090'
    Object.seal(this)
  }
}
