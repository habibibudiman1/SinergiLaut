const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const e2eDir = path.join(__dirname, 'cypress', 'e2e');
const files = fs.readdirSync(e2eDir).filter(f => f.startsWith('FR-') && f.endsWith('.cy.ts'));

console.log(`Found ${files.length} FR tests to run.`);

let passed = [];
let failed = [];

for (const file of files) {
  console.log(`\n\n--- Running ${file} ---`);
  try {
    execSync(`pnpm run cypress:run --spec "cypress/e2e/${file}"`, { stdio: 'inherit' });
    passed.push(file);
    console.log(`✅ ${file} passed.`);
  } catch (err) {
    failed.push(file);
    console.log(`❌ ${file} failed.`);
  }
}

console.log('\n\n=== SUMMARY ===');
console.log(`Passed (${passed.length}):\n${passed.join('\n')}`);
console.log(`Failed (${failed.length}):\n${failed.join('\n')}`);
