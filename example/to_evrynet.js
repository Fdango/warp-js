import Warp from '@/modules/warp'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
const recipient = '0xC2bA31993ec1408b6959d2DF7D3a8fc018328EBf'
const sender = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp
  .toEvrynet({
    src: sender.secret,
    amount: '1.0',
    asset: xlm,
    evrynetAddress: recipient,
  })
  .then(console.log)
  .catch(console.error)
