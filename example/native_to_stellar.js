import Warp from '@/warp'

const warp = new Warp()
const evry = warp.utils.getEvryAsset()
let recipient = 'SDRQBLF772WER7UHHJPFVLHTDTRMNURXCVSMKJFUOC4XJCUJC4NA4COH'
let sender = 'e21b5ec43b500add6a5574b07791944ae8b2d41851f02eefb276305b3d703d49'

warp
  .toStellar({
    evrynetPriv: sender,
    stellarPriv: recipient,
    amount: '0.01',
    asset: evry,
  })
  .then(console.log)
  .catch(console.error)
