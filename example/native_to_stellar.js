import Warp from '@/modules/warp'

const warp = new Warp()
const evry = warp.utils.getEvryAsset()
const sender =
  '190d4b3a49696f14302a70f923aa47d5a81f1a4f3cad94ed47c2572f8704389d'
const recipient = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp
  .toStellar({
    evrynetPriv: sender,
    stellarPriv: recipient.secret,
    amount: '1.0',
    asset: evry,
  })
  .then(console.log)
  .catch(console.error)
