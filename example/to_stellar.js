import Warp from '@/modules/warp'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
const sender =
  'd64992d958e3c3b7c71a33780da33fc248d4db62f315776b683cb64309119b02'
const recipient = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp
  .toStellar({
    evrynetPriv: sender,
    stellarPriv: recipient.secret,
    amount: '99',
    asset: xlm,
  })
  .then(console.log)
  .catch(console.error)
