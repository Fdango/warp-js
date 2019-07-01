import warp from '../lib/index.js';

let xlm = warp.asset.XLM;
let sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52';
let recipient = 'evrynetAddress';
let config = new warp.config("localhost:8080");

warp.ToEvrynet(sender, "10", xlm, recipient, config)
  .then(console.log)
  .catch(console.error);

