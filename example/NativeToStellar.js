import warp from '../src/index.js';

let evry = warp.asset.Evry();
let sender = 'e21b5ec43b500add6a5574b07791944ae8b2d41851f02eefb276305b3d703d49';
let recipient = 'SDRQBLF772WER7UHHJPFVLHTDTRMNURXCVSMKJFUOC4XJCUJC4NA4COH';
let conf = new warp.config('localhost:8080');

warp.ToStellar(sender, recipient, '0.001', evry, conf)
  .then(console.log)
  .catch(console.error);

