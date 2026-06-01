import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import * as fs from "fs";
import * as path from "path";

// Load env manually
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
}

const mantleTestnet = defineChain({
  id: 5003,
  name: "Mantle Sepolia Testnet",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: [env.MANTLE_TESTNET_RPC_URL || "https://rpc.sepolia.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.sepolia.mantle.xyz" },
  },
});

async function deployContract(
  walletClient: ReturnType<typeof createWalletClient>,
  publicClient: ReturnType<typeof createPublicClient>,
  account: ReturnType<typeof privateKeyToAccount>,
  name: string,
  bytecode: `0x${string}`,
  abi: unknown[]
): Promise<string> {
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    account,
    chain: mantleTestnet,
  });

  console.log(`   TX Hash: ${hash}`);
  console.log(`   Waiting for confirmation...`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const address = receipt.contractAddress;
  if (!address) throw new Error(`No contract address in receipt for ${name}`);
  return address;
}

async function main() {
  const rawKey = env.DEPLOYER_PRIVATE_KEY;
  if (!rawKey || rawKey === "your_private_key_here") {
    throw new Error("DEPLOYER_PRIVATE_KEY not set in .env.local");
  }
  const privateKey = rawKey as `0x${string}`;

  const account = privateKeyToAccount(privateKey);

  const publicClient = createPublicClient({
    chain: mantleTestnet,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: mantleTestnet,
    transport: http(),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log("🚀 Deploying Sovereign contracts to Mantle Sepolia Testnet");
  console.log("─".repeat(55));
  console.log(`   Deployer: ${account.address}`);
  console.log(`   Balance:  ${Number(balance) / 1e18} MNT\n`);

  if (balance === 0n) {
    throw new Error("Deployer wallet has 0 MNT. Get testnet tokens from faucet.testnet.mantle.xyz");
  }

  // Read compiled artifacts
  const readArtifact = (contractName: string) => {
    const artifactPath = path.resolve(
      process.cwd(),
      `artifacts/contracts/${contractName}.sol/${contractName}.json`
    );
    return JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  };

  // Deploy SovereignIdentity
  console.log("📋 Deploying SovereignIdentity...");
  const identityArtifact = readArtifact("SovereignIdentity");
  const identityAddress = await deployContract(
    walletClient, publicClient, account,
    "SovereignIdentity",
    identityArtifact.bytecode,
    identityArtifact.abi
  );
  console.log(`✅ SovereignIdentity: ${identityAddress}\n`);

  // Deploy ProofRegistry
  console.log("📋 Deploying ProofRegistry...");
  const proofArtifact = readArtifact("ProofRegistry");
  const proofAddress = await deployContract(
    walletClient, publicClient, account,
    "ProofRegistry",
    proofArtifact.bytecode,
    proofArtifact.abi
  );
  console.log(`✅ ProofRegistry: ${proofAddress}\n`);

  // Deploy ReputationRegistry
  console.log("📋 Deploying ReputationRegistry...");
  const repArtifact = readArtifact("ReputationRegistry");
  const repAddress = await deployContract(
    walletClient, publicClient, account,
    "ReputationRegistry",
    repArtifact.bytecode,
    repArtifact.abi
  );
  console.log(`✅ ReputationRegistry: ${repAddress}\n`);

  console.log("─".repeat(55));
  console.log("✨ All contracts deployed!\n");
  console.log("📝 Add these to your .env.local:\n");
  console.log(`NEXT_PUBLIC_SOVEREIGN_IDENTITY_ADDRESS=${identityAddress}`);
  console.log(`NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS=${proofAddress}`);
  console.log(`NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS=${repAddress}`);

  // Auto-update .env.local
  let updatedEnv = envContent;
  updatedEnv = updatedEnv.replace(
    /NEXT_PUBLIC_SOVEREIGN_IDENTITY_ADDRESS=.*/,
    `NEXT_PUBLIC_SOVEREIGN_IDENTITY_ADDRESS=${identityAddress}`
  );
  updatedEnv = updatedEnv.replace(
    /NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS=.*/,
    `NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS=${proofAddress}`
  );
  updatedEnv = updatedEnv.replace(
    /NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS=.*/,
    `NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS=${repAddress}`
  );
  fs.writeFileSync(envPath, updatedEnv);
  console.log("\n✅ .env.local updated automatically!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
