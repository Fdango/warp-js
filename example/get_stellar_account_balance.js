import Warp from '@/modules/warp'
import config from '@/config/config'
const {
  stellar: { EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB },
  evrynet: { ATOMIC_EVRY_DECIMAL_UNIT },
} = config

const warp = new Warp()
const evry = new warp.utils.WhitelistedAsset({
  code: EVRY_ASSET_NAME,
  issuer: EVRY_ASSET_ISSUER_PUB,
  decimal: ATOMIC_EVRY_DECIMAL_UNIT,
})
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
