require('dotenv').config();
const fs = require("fs");
const spawn = require("cross-spawn");
const path = require("path");
const Keypair = require("@solana/web3.js").Keypair;

const SLASH = path.sep;

const programAuthorityKeyfileName = `keys/authority-keypair.json`
const programAuthorityKeypairFile = path.resolve(
    `${__dirname}${SLASH}${programAuthorityKeyfileName}`
);

const programKeyfileName = `keys/${process.env.PROGRAM_NAME}-keypair.json`
const programKeypairFile = path.resolve(
    `${__dirname}${SLASH}${programKeyfileName}`
);

function readKeyfile(keypairfile) {
    let kf = fs.readFileSync(keypairfile);
    let parsed = JSON.parse(kf.toString()); // [1,1,2,2,3,4]
    kf = new Uint8Array(parsed);
    const keypair = Keypair.fromSecretKey(kf);
    return keypair;
};

(async () => {
    let programAuthorityKeypair;
    let programKeypair;

    programKeypair = readKeyfile(programKeypairFile);
    
    try {
        programAuthorityKeypair = readKeyfile(programAuthorityKeypairFile);
    } catch (e) {
        console.log('Missing authority-keypair.json in /keys. Please store a funded authority keypair in the folder in order to deploy.');
        return;
    }

    console.log(`\n\n\⚙️ Deploying program.\n`);

    spawn.sync(
        "anchor",
        [
            "deploy",
            "--provider.cluster",
            process.env.CLUSTER,
            "--provider.wallet",
            `${programAuthorityKeypairFile}`,
        ],
        { stdio: "inherit" }
    )

    fs.copyFile(
        `../target/idl/${process.env.PROGRAM_NAME}.json`,
        `../app/src/lib/idl/${process.env.PROGRAM_NAME}.json`,
        (err) => {
            if (err) throw err
            console.log(`ABI ${process.env.PROGRAM_NAME}.json was copied to ./app`)
        }
    )
})();