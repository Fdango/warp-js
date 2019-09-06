import Warp from '@/modules/warp'

const warp = new Warp()
const xlm = warp.utils.getLumensAsset()
const recipient = '90200A44D0A538B4C886F3B2B835F29CE4C717AA32D0427D8559874E2867C943'
const sender = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp
  .toEvrynet({
    stellarPriv: sender.secret,
    amount: '10.0',
    asset: xlm,
    evrynetPriv: recipient,
  })
  .then(console.log)
  .catch(console.error)
