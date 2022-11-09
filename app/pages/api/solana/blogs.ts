import idl from '../../lib/idl/blogs.json';
import Workspace from '../../lib/solana/Workspace';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor'; // includes https://solana-labs.github.io/solana-web3.js/
import { AccountInfo } from '@solana/web3.js';

export async function getOwner(workspace: Workspace) {
    if (!workspace) return { success: false, errorCode: "WALLET_NOT_LOGGED" };

    // convert our string to PublicKey type
		let blogAccount = new anchor.web3.PublicKey(idl.metadata.address);
		const [metadata_pda, _] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode("program-metadata")],
			blogAccount
		);

		const metadata_acc = await workspace.connection.getParsedAccountInfo(metadata_pda)
		console.log(metadata_acc)
	return metadata_acc;
}