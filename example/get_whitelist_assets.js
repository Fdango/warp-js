import Warp from '@/modules/warp'

const warp = new Warp()

warp.client.evry
  .getWhitelistAssets()
  .then(console.log)
  .catch(console.error)
