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

## Address Generation

Use `generate-address.ts` to derive Bitcoin addresses from an xpub:

```bash
bun generate-address.ts <xpub> [address-type] [count] [change]
```

### Address Types
- `legacy`: P2PKH addresses starting with "1"
- `segwit`: P2SH-wrapped SegWit addresses starting with "3"
- `native-segwit`: Native SegWit addresses starting with "bc1q" (default)
- `taproot`: Taproot addresses starting with "bc1p"

### Examples

Generate 5 native SegWit addresses:
```bash
bun generate-address.ts xpub6BosfCnifzxcFwrSzQiqu2DBVTshkCXacvNsWGYJVVhhawA7d4R5WSWGFNbi8Aw6ZRc1brxMyWMzG3DSSSSoekkudhUd9yLb6qx39T9nMdj
```

Generate 10 legacy addresses:
```bash
bun generate-address.ts xpub... legacy 10
```

Generate 5 change addresses:
```bash
bun generate-address.ts xpub... native-segwit 5 change
```