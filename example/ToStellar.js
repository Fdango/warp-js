import warp from '../src/index.js';

let xlm = warp.asset.Lumens();
let sender = 'e21b5ec43b500add6a5574b07791944ae8b2d41851f02eefb276305b3d703d49';
let recipient = 'SBXR25BQX2RFXAS5PUGMJR6BJSSPKCL74HCUBWXY6K3XPIIQO3D6LFBS';
let conf = new warp.config('localhost:8080');

warp.ToStellar(sender, recipient, '0.001', xlm, conf)
  .then(console.log)
  .catch(console.error);

