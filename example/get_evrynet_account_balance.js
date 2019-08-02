import Warp from '@/modules/warp'

const warp = new Warp()
const evry = warp.utils.getEvryAsset()
const account = {
  secret: 'SADFSJ45OOSLJZMRSN4X3577NBC5NNKTK4JYE4DS5M34UIVILDC7EW3O',
  address: 'GB6T7Y6DAEYPSLV3NDH5YFJOMJGGNADTNVCYNSUM74SS77NADWM4BHHH',
}

warp.client.stellar
  .getAccountBalance(account.address, evry)
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
