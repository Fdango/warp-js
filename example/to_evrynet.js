import Warp from '@/modules/warp'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
const recipient = '0x9993B01f1BBAF72f3B8f5fee269f15e483655e43'
const sender = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp
  .toEvrynet({
    src: sender.secret,
    amount: '10.0',
    asset: xlm,
    evrynetAddress: recipient,
  })
  .then(console.log)
  .catch(console.error)
