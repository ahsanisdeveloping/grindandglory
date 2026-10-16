import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const values = readFileSync(".env", "utf8").split(/\r?\n/)
  .filter((line) => /^ELDORADO_CLIENT_(ID|SECRET)=/.test(line))
  .map((line) => line.slice(line.indexOf("=") + 1).trim()).filter(Boolean);
if (values.length !== 2) throw new Error("Expected two Eldorado credential variables");
let checked = 0;
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (/\.(js|json|html|map)$/.test(path)) {
      const content = readFileSync(path, "utf8");
      checked++;
      if (values.some((value) => content.includes(value))) {
        // Report the artifact path only. Never print the matched credential.
        throw new Error(`Credential found in public artifact: ${path}`);
      }
    }
  }
}
scan(".next/static");
console.log(`Checked ${checked} public production artifacts: no Eldorado credentials found.`);
