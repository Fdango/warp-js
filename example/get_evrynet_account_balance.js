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
  address: '0x2D47797d8B00F6C057B99EE940965247BEd0EB1C',
}

warp.client.evry
  .getBalance(account.address, evry)
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
