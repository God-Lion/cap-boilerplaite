const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkPackage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const pkg = JSON.parse(content);
    let issues = [];

    if (!pkg.name) issues.push('Missing name');
    if (!pkg.version) issues.push('Missing version');
    else if (pkg.version.trim() === '') issues.push('Empty version');

    const depKeys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    depKeys.forEach(key => {
      if (pkg[key]) {
        for (const [dep, ver] of Object.entries(pkg[key])) {
          if (ver === '' || ver === null || ver === undefined) {
            issues.push(`Empty version for dependency "${dep}" in ${key}`);
          }
        }
      }
    });

    if (issues.length > 0) {
      console.log(`ISSUE in ${filePath}:`);
      issues.forEach(i => console.log(`  - ${i}`));
    }
  } catch (err) {
    console.log(`FAILED TO READ/PARSE ${filePath}: ${err.message}`);
  }
}

try {
  const allFiles = execSync('dir /s /b package.json', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean)
    .map(f => f.trim());

  allFiles.forEach(f => {
    if (f.includes('node_modules')) return;
    checkPackage(f);
  });
} catch (err) {
  console.error('Error finding package.json files:', err.message);
}
