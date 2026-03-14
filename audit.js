const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'packages/modules/auth/src/screens');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(screensDir);

const results = [];

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(screensDir, file);

  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  // CRITICAL
  if (content.includes('InputProps=')) {
    critical++;
  }
  if (content.includes('<Button') && !content.includes('info.main') && !content.includes('color="info"')) {
    critical++;
  }

  // HIGH
  if (!content.includes('animate-scale-in') && !content.includes('<motion.div')) {
    high++;
  }
  if (content.includes("textTransform: 'uppercase'") && content.includes('<Button')) {
    high++;
  }

  // MEDIUM
  if (content.includes('<Divider') && !content.includes('opacity')) {
    medium++;
  }
  if (content.includes('<Avatar') && !content.includes("borderRadius: '24px'") && !content.includes('borderRadius: 24')) {
    medium++;
  }

  // LOW
  if (content.includes('<IconButton') && !content.includes('aria-label')) {
    low++;
  }
  // Check for t('key') without fallback. A simple regex: t\(['"`][^'"`]+['"`]\) matches t('key'). We check if it exists.
  const tMatches = content.match(/t\(['"`][^'"`]+['"`]\)/g);
  if (tMatches) {
    low++;
  }

  if (critical > 0 || high > 0 || medium > 0 || low > 0) {
    results.push({ file: relPath, critical, high, medium, low });
  }
});

// Sort by critical desc, high desc
results.sort((a, b) => b.critical - a.critical || b.high - a.high || b.medium - a.medium || b.low - a.low);

let output = '| File | CRITICAL | HIGH | MEDIUM | LOW |\n';
output += '|---|---|---|---|---|\n';
results.forEach(r => {
  output += `| \`${r.file}\` | ${r.critical} | ${r.high} | ${r.medium} | ${r.low} |\n`;
});

fs.writeFileSync('audit_results.md', output, 'utf8');
