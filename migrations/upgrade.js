require('dotenv').config();
const fs = require("fs");
const spawn = require("cross-spawn");
const path = require("path");
const Keypair = require("@solana/web3.js").Keypair;

const SLASH = path.sep

const programAuthorityKeyfileName = `keys/authority-keypair.json`
const programAuthorityKeypairFile = path.resolve(
    `${__dirname}${SLASH}${programAuthorityKeyfileName}`
);

const programKeyfileName = `keys/${process.env.PROGRAM_NAME}-keypair.json`
const programKeypairFile = path.resolve(
    `${__dirname}${SLASH}${programKeyfileName}`
);

function readKeyfile(keypairfile) {
    let kf = fs.readFileSync(keypairfile)
    let parsed = JSON.parse(kf.toString()) // [1,1,2,2,3,4]
    kf = new Uint8Array(parsed)
    const keypair = Keypair.fromSecretKey(kf)
    return keypair
}

;(async () => {
    let programAuthorityKeypair;
    let programId;
    let programKeypair;

    programKeypair = readKeyfile(programKeypairFile);
    console.log({ publicKey: programKeypair.publicKey });
    programId = programKeypair.publicKey.toString();

    try {
        programAuthorityKeypair = readKeyfile(programAuthorityKeypairFile);
    } catch (e) {
        console.log('Missing authority-keypair.json in /keys. Please store a funded authority keypair in the folder in order to upgrade.');
        return;
    }

    console.log(`\n\n\⚙️ Upgrading program.\n`);

    spawn.sync(
        "anchor",
        [
            "upgrade",
            `../target/deploy/${process.env.PROGRAM_NAME}.so`,
            "--program-id",
            programId,
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
            console.log(`Updated ABI ${process.env.PROGRAM_NAME}.json was copied to ./app`)
        }
    )
})();