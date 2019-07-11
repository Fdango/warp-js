import warp from '../src/index.js';

let evry = warp.asset.Evry();
let sender = 'SCKB4S5A6R4W665UVXJ2PRVC5HL6MXS5VOVYIOZT4NM6HDRM7ZHO2XVO';
let recipient = '0xA0C8451FD06e8AdC7acF1cCf15804Fa1a2F185b3';
let conf = new warp.config("localhost:8080");

warp.ToEvrynet(sender, "0.01", evry, recipient, conf)
  .then(console.log)
  .catch(console.error);

