import Warp from '@/warp'

const warp = new Warp()
const evry = warp.utils.getEvryAsset()
let sender = 'SCKB4S5A6R4W665UVXJ2PRVC5HL6MXS5VOVYIOZT4NM6HDRM7ZHO2XVO'
let recipient = '0xA0C8451FD06e8AdC7acF1cCf15804Fa1a2F185b3'

warp
  .toEvrynet({
    src: sender,
    amount: '0.01',
    asset: evry,
    evrynetAddress: recipient,
  })
  .then(console.log)
  .catch(console.error)
