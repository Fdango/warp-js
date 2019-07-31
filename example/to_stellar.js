import Warp from '../src/index.js'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
let recipient = 'SBXR25BQX2RFXAS5PUGMJR6BJSSPKCL74HCUBWXY6K3XPIIQO3D6LFBS'
let sender = 'cb5a3eab37b031594180625ef101dfa66809383624fe6b631301cec2b8f52292'

warp
  .toStellar({
    evrynetPriv: sender,
    stellarPriv: recipient,
    amount: '0.01',
    asset: xlm,
  })
  .then(console.log)
  .catch(console.error)
