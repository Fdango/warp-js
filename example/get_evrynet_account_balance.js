import Warp from '@/modules/warp'

const warp = new Warp()
const evry = warp.utils.getLumensAsset()
const account = {
  address: '0x757056B6b1Ea179D6b22F6CCF2E1E597D00bF638',
}

warp.client.evry
  .getAccountBalance(account.address, evry)
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
