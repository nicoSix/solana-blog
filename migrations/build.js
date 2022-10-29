require('dotenv').config();
const fs = require("fs");
const spawn = require("cross-spawn");
const path = require("path");
const Keypair = require("@solana/web3.js").Keypair;

const SLASH = path.sep;

const programKeyfileName = `../target/deploy/${process.env.PROGRAM_NAME}-keypair.json`;
const programKeypairFile = path.resolve(
    `${__dirname}${SLASH}${programKeyfileName}`
);

const newProgramKeyfileName = `./keys/${process.env.PROGRAM_NAME}-keypair.json`;
const newProgramKeypairFile = path.resolve(
    `${__dirname}${SLASH}${newProgramKeyfileName}`
);

function readKeyfile(keypairfile) {
    let kf = fs.readFileSync(keypairfile)
    let parsed = JSON.parse(kf.toString()) // [1,1,2,2,3,4]
    kf = new Uint8Array(parsed)
    const keypair = Keypair.fromSecretKey(kf)
    return keypair
};

(async () => {
    spawn.sync("anchor", ["build"], { stdio: "inherit" });

    console.log(`\n\n\⚙️ Building program.\n`);

    fs.copyFile(
        programKeypairFile,
        newProgramKeypairFile,
        (err) => {
            if (err) throw err;
            else {
                programKeypair = readKeyfile(programKeypairFile);
                console.log(`Program public key: ${programKeypair.publicKey.toString()}`);
                console.log(`Don't forget to replace the default key in your Solana program by this one!`);
            }
        }
    )
})();