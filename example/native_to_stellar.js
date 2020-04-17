import Warp from '@/modules/warp'

const warp = new Warp()
const evry = warp.utils.getEvryAsset()
const sender =
  '0a05a1645d8a0a5b8f593c84324ea36194211814ccc51211e81e6b09cf7a5460'
const recipient = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp
  .toStellar({
    evrynetPriv: sender,
    stellarPriv: recipient.secret,
    amount: '5',
    asset: evry,
  })
  .then(console.log)
  .catch(console.error)
