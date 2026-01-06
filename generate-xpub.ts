import { HDKey } from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

function generateXpub(seedPhrase: string, network: "mainnet" | "testnet" = "mainnet") {
  // Validate seed phrase
  if (!bip39.validateMnemonic(seedPhrase, wordlist)) {
    throw new Error("Invalid seed phrase");
  }

  // Convert seed phrase to seed
  const seed = bip39.mnemonicToSeedSync(seedPhrase);

  // Create HD key from seed
  const hdKey = HDKey.fromMasterSeed(seed);

  // Derive account 0 for BIP44 (m/44'/0'/0')
  // 44' = purpose (BIP44)
  // 0' = coin type (0 for Bitcoin mainnet, 1 for testnet)
  // 0' = account
  const coinType = network === "mainnet" ? 0 : 1;
  const accountPath = `m/44'/${coinType}'/0'`;
  const account = hdKey.derive(accountPath);

  // Get extended public key - for Bitcoin mainnet it's xpub
  const xpub = network === "mainnet" 
    ? account.publicExtendedKey 
    : account.publicExtendedKey; // For testnet, this would typically be tpub

  return {
    xpub,
    path: accountPath,
    fingerprint: account.fingerprint?.toString(16).padStart(8, "0"),
  };
}

// Example usage
if (import.meta.main) {
  const seedPhrase = process.argv[2];
  const network = (process.argv[3] as "mainnet" | "testnet") || "mainnet";

  if (!seedPhrase) {
    console.error("Please provide a seed phrase as the first argument");
    console.error("Usage: bun generate-xpub.ts \"seed phrase words\" [mainnet|testnet]");
    process.exit(1);
  }

  try {
    const result = generateXpub(seedPhrase, network);
    console.log("Extended Public Key (xpub):", result.xpub);
    console.log("Derivation Path:", result.path);
    console.log("Fingerprint:", result.fingerprint);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

export { generateXpub };