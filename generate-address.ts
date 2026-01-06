import { HDKey } from "@scure/bip32";
import { p2pkh, p2sh, p2wpkh, p2wsh, p2tr } from "@scure/btc-signer";
import { hex } from "@scure/base";

type AddressType = "legacy" | "segwit" | "native-segwit" | "taproot";

function generateAddress(
  xpub: string,
  index: number,
  isChange: boolean = false,
  addressType: AddressType = "native-segwit"
): string {
  // Parse the extended public key
  const hdKey = HDKey.fromExtendedKey(xpub);
  
  // Derive the address path (0 for external, 1 for change)
  const chainIndex = isChange ? 1 : 0;
  const addressKey = hdKey.derive(`m/${chainIndex}/${index}`);
  
  if (!addressKey.publicKey) {
    throw new Error("Failed to derive public key");
  }

  // Generate address based on type
  switch (addressType) {
    case "legacy":
      // P2PKH - Pay to Public Key Hash (1...)
      return p2pkh(addressKey.publicKey).address!;
    
    case "segwit":
      // P2SH-P2WPKH - Pay to Script Hash wrapped SegWit (3...)
      const p2wpkhScript = p2wpkh(addressKey.publicKey);
      return p2sh(p2wpkhScript).address!;
    
    case "native-segwit":
      // P2WPKH - Native SegWit (bc1q...)
      return p2wpkh(addressKey.publicKey).address!;
    
    case "taproot":
      // P2TR - Taproot (bc1p...)
      return p2tr(addressKey.publicKey.slice(1)).address!;
    
    default:
      throw new Error(`Unknown address type: ${addressType}`);
  }
}

function generateAddressBatch(
  xpub: string,
  count: number = 10,
  isChange: boolean = false,
  addressType: AddressType = "native-segwit"
): { index: number; address: string; path: string }[] {
  const addresses = [];
  const chainIndex = isChange ? 1 : 0;
  
  for (let i = 0; i < count; i++) {
    const address = generateAddress(xpub, i, isChange, addressType);
    addresses.push({
      index: i,
      address,
      path: `m/44'/0'/0'/${chainIndex}/${i}`
    });
  }
  
  return addresses;
}

// Example usage
if (import.meta.main) {
  const xpub = process.argv[2];
  const addressType = (process.argv[3] as AddressType) || "native-segwit";
  const count = parseInt(process.argv[4]) || 5;
  const isChange = process.argv[5] === "change";

  if (!xpub) {
    console.error("Please provide an xpub as the first argument");
    console.error("Usage: bun generate-address.ts <xpub> [address-type] [count] [change]");
    console.error("Address types: legacy, segwit, native-segwit, taproot");
    console.error("Example: bun generate-address.ts xpub... native-segwit 10");
    process.exit(1);
  }

  try {
    console.log(`Generating ${count} ${isChange ? "change" : "external"} ${addressType} addresses:\n`);
    
    const addresses = generateAddressBatch(xpub, count, isChange, addressType);
    addresses.forEach(({ index, address, path }) => {
      console.log(`${index}: ${address} (${path})`);
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

export { generateAddress, generateAddressBatch };