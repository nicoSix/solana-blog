use anchor_lang::prelude::*;

declare_id!("4xg1SmxxqfgXY98iJShQZiCm1AToXPb5g4dEpgzmCGiE");

#[program]
pub mod blogs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.program_metadata.owner = *ctx.accounts.authority.key;
        ctx.accounts.program_metadata.paused = false;
        Ok(())
    }

    pub fn get_owner(ctx: Context<GetOwner>) -> Result<Pubkey> {
        Ok(ctx.accounts.program_metadata.owner)
    }
}

#[account]
pub struct ProgramMetadata {
    owner: Pubkey,
    paused: bool
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
        space = 8 // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
        + 32 // 3.B) authority: Pubkey needs 32 bytes
        + 1 // 3.C) paused boolean
        // You have to do this math yourself, there's no macro for this
    )]
    pub program_metadata: Account<'info, ProgramMetadata>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
