use anchor_lang::prelude::*;
use anchor_lang::solana_program::msg;

declare_id!("B1uv5dUpmKW32HbDgt1uAX9yz94McuxpkHsPVsWtZxgU");

#[program]
pub mod blogs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        ctx.accounts.program_metadata.owner = *ctx.accounts.authority.key;
        ctx.accounts.program_metadata.paused = false;
        ctx.accounts.program_metadata.bump = bump;
        Ok(())
    }
}

#[account]
pub struct ProgramMetadata {
    owner: Pubkey,
    paused: bool,
    bump: u8
}

#[derive(Accounts)]
pub struct GetOwner<'info> {
    pub program_metadata: Account<'info, ProgramMetadata>
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, // 1. Hey Anchor, initialize an account with these details for me
        payer = authority, // 2. See that authority Signer (pubkey) down there? They're paying for this
        seeds = [b"program-metadata"],
        bump,
        space = 8 // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
        + 32 // 3.B) authority: Pubkey needs 32 bytes
        + 1 // 3.C) paused boolean,
        + 1 // bump size
        // You have to do this math yourself, there's no macro for this
    )]
    pub program_metadata: Account<'info, ProgramMetadata>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
