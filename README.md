# XPub Generator

Generate extended public keys (xpub) from BIP39 seed phrases using BIP44 derivation paths.

## Installation

```bash
bun install
```

## Usage

```bash
bun generate-xpub.ts "your twelve word seed phrase here" [mainnet|testnet]
```

### Examples

Generate xpub for Bitcoin mainnet (default):
```bash
bun generate-xpub.ts "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
```

Generate xpub for Bitcoin testnet:
```bash
bun generate-xpub.ts "your seed phrase here" testnet
```

## Output

The script outputs:
- **Extended Public Key (xpub)**: The derived extended public key for the account
- **Derivation Path**: The BIP44 path used (m/44'/0'/0' for mainnet, m/44'/1'/0' for testnet)
- **Fingerprint**: The key fingerprint in hexadecimal

## Technical Details

- Uses BIP39 for seed phrase validation and conversion
- Implements BIP44 HD wallet structure
- Derives at account level (m/44'/coin_type'/0')
- Supports both Bitcoin mainnet (coin_type=0) and testnet (coin_type=1)

## Security Note

Never share your seed phrase. This tool should only be used with seed phrases you control. The xpub can be shared safely as it only allows viewing addresses and balances, not spending funds.