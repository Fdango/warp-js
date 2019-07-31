import warp from '../src/index.js'

let xlm = warp.asset.Lumens()
let sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52'
let recipient = '0xA0C8451FD06e8AdC7acF1cCf15804Fa1a2F185b3'
let conf = new warp.config('localhost:8080')

warp
  .ToEvrynet(sender, '0.01', xlm, recipient, conf)
  .then(console.log)
  .catch(console.error)
