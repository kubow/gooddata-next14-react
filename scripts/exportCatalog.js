// scripts/exportCatalog.js
// Load variables from your Next.js .env.local
require("dotenv").config({ path: ".env" }); // load from .env

const { spawnSync } = require("child_process");

// Map NEXT_PUBLIC_* vars from your Next.js env to the vars catalog-export expects
// Get vars from .env
const hostname = process.env.NEXT_PUBLIC_GD_HOSTNAME;
const workspace = process.env.NEXT_PUBLIC_GD_WORKSPACE_ID;
process.env.BACKEND = process.env.NEXT_PUBLIC_GD_BACKEND || "tiger"; // default to tiger

console.log("Please export `TIGER_API_TOKEN before proceeding`");
// Optionally log to verify
if (!hostname || !workspace) {
  console.error("Missing NEXT_PUBLIC_GD_HOSTNAME or NEXT_PUBLIC_GD_WORKSPACE in .env");
  process.exit(1);
}

console.log("Exporting GoodData catalog with:");
console.log(`  Hostname: ${hostname}`);
console.log(`  Workspace: ${workspace}`);

spawnSync(
  "npx",
  [
    "gdc-catalog-export",
    "--hostname", hostname,
    "--workspace-id", workspace,
    "--catalog-output", "catalog.ts"
  ],
  { stdio: "inherit" }
);