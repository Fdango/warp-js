import Warp from '@/warp'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
let recipient = '0xA0C8451FD06e8AdC7acF1cCf15804Fa1a2F185b3'
let sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52'

warp
  .toEvrynet({
    src: sender,
    amount: '0.01',
    asset: xlm,
    evrynetAddress: recipient,
  })
  .then(console.log)
  .catch(console.error)
