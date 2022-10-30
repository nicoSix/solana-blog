import { Connection } from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import idl from '../idl/blogs.json';

export default class Workspace {
    wallet: AnchorWallet;
    connection: Connection;
    provider: AnchorProvider;
    program: Program;

    constructor(wallet: AnchorWallet) {
        this.wallet = wallet;
        const network = WalletAdapterNetwork.Devnet;
        const endpoint = clusterApiUrl(network);
        this.connection = new Connection(endpoint);
        this.provider = new AnchorProvider(this.connection, this.wallet, { commitment: "confirmed" });
        // @ts-ignore
        this.program = new Program(idl, idl.metadata.address, this.provider);
    }
};