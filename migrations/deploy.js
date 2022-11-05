require('dotenv').config();
const fs = require("fs");
const spawn = require("cross-spawn");
const path = require("path");
const Keypair = require("@solana/web3.js").Keypair;
const PublicKey = require("@solana/web3.js").PublicKey;
const anchor = require("@project-serum/anchor");

const SKIP = process.env.SKIP;
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
    let parsed = readJSONFile(keypairfile);
    let kf = new Uint8Array(parsed);
    const keypair = Keypair.fromSecretKey(kf);
    return keypair;
};

function readJSONFile(file) {
    let content = fs.readFileSync(file);
    let parsed = JSON.parse(content.toString()); // [1,1,2,2,3,4]
    return parsed;
};

(async () => {
    let programAuthorityKeypair;
    let programKeypair;

    programKeypair = readKeyfile(programKeypairFile);
    let programId = programKeypair.publicKey;
    
    
    try {
        programAuthorityKeypair = readKeyfile(programAuthorityKeypairFile);
    } catch (e) {
        console.log('Missing authority-keypair.json in /keys. Please store a funded authority keypair in the folder in order to deploy.');
        return;
    }

    if (true) {

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

        try {
            fs.copyFileSync(
                `../target/idl/${process.env.PROGRAM_NAME}.json`,
                `../app/pages/lib/idl/${process.env.PROGRAM_NAME}.json`
            );

            console.log(`ABI ${process.env.PROGRAM_NAME}.json was copied to ./app`);
        } catch (e) {
            console.error(`Failed to copy ABI to /app/pages/lib/idl: ${e}`);
        }
    }

    const idlName = `../target/idl/${process.env.PROGRAM_NAME}.json`
    const idlFile = path.resolve(
        `${__dirname}${SLASH}${idlName}`
    );

    const wallet = new anchor.Wallet(programAuthorityKeypair);
    const idl = readJSONFile(idlFile);
    let connection = new anchor.web3.Connection(
        "https://api.devnet.solana.com",
        "confirmed"
    )

    const [metadata_pda, metadata_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("program-metadata")],
        programId
    );

    let provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
    let program = new anchor.Program(idl, programId, provider);

    const tx = await program.methods
        .initialize(metadata_bump)
        .accounts({
            programMetadata: metadata_pda,
            authority: programAuthorityKeypair.publicKey.toString(),
            systemProgram: anchor.web3.SystemProgram.programId  
        })
        .signers([programAuthorityKeypair])
        .rpc();

    console.log(tx);
})();