import Warp from '@/modules/warp'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
const recipient = '0x2D47797d8B00F6C057B99EE940965247BEd0EB1C'
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
