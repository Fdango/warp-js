import Warp from '@/modules/warp'

const warp = new Warp()
const evry = warp.utils.getEvryAsset()
const sender = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}
const recipient = '0x9993B01f1BBAF72f3B8f5fee269f15e483655e43'

warp
  .toEvrynet({
    src: sender.secret,
    amount: '10.0',
    asset: evry,
    evrynetAddress: recipient,
  })
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
