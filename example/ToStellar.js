import warp from '../src/index.js';

let xlm = warp.asset.Lumens();
let sender = '2ec3fa79b5abe6069df85f33f6ebc858b1b08f6ea5fb91713ea109098b59b2a0';
let recipient = 'SBXR25BQX2RFXAS5PUGMJR6BJSSPKCL74HCUBWXY6K3XPIIQO3D6LFBS';
let conf = new warp.config('localhost:8080');

warp.ToStellar(sender, recipient, '10', xlm, conf)
  .then(console.log)
  .catch(console.error);

