

const fs = require("fs");
require('dotenv').config();
const path = require("path");
const Keypair = require("@solana/web3.js").Keypair;
const SLASH = path.sep;

let programKeypair = new Keypair();
let PROGRAM_NAME = process.env.PROGRAM_NAME || "program";

const programKeyfileName = `keys/${PROGRAM_NAME}-keypair.json`
const programKeypairFile = path.resolve(
    `${__dirname}${SLASH}${programKeyfileName}`
);

try {
  fs.writeFileSync(
    programKeypairFile,
    `[${Buffer.from(programKeypair.secretKey.toString())}]`
  )

  console.log(`Program public key: ${programKeypair.publicKey.toString()}`);
  console.log(`Don't forget to replace the default key in your Solana program by this one!`);
} catch (e) {
  console.error(`Failed to generate key: ${e}`);
}