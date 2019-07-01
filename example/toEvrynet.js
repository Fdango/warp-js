import warp from '../src/index.js';

let xlm = warp.asset.XLM();
let sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52';
let recipient = '0x60569ebea69885b37c816b2b1c58570ec115f196';
let conf = new warp.config("localhost:8080");

warp.ToEvrynet(sender, "10", xlm, recipient, conf)
  .then(console.log)
  .catch(console.error);

