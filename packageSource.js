const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const tempDir = path.join(rootDir, 'temp_clean_source');
const zipFile = path.join(rootDir, 'BookStore_MERN_SourceCode.zip');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true });
}

fs.mkdirSync(tempDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (child === 'node_modules' || child === '.git' || child === 'build') continue;
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy backend files
const topFiles = ['server.js', 'package.json', 'seed.js', 'demoTest.js', 'testInsertData.js', '.gitignore', 'BaoCao_BookStore_MERN.html', 'models', 'routes'];
for (const item of topFiles) {
  const p = path.join(rootDir, item);
  if (fs.existsSync(p)) {
    copyRecursive(p, path.join(tempDir, item));
  }
}

// Copy client files (excluding node_modules and build)
const clientSrc = path.join(rootDir, 'client');
const clientDest = path.join(tempDir, 'client');
fs.mkdirSync(clientDest, { recursive: true });
['package.json', 'public', 'src'].forEach(item => {
  const p = path.join(clientSrc, item);
  if (fs.existsSync(p)) {
    copyRecursive(p, path.join(clientDest, item));
  }
});

// Compress using powershell
execSync(`powershell -ExecutionPolicy Bypass -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipFile}'"`);
fs.rmSync(tempDir, { recursive: true, force: true });

const sizeKB = (fs.statSync(zipFile).size / 1024).toFixed(1);
console.log(`✅ Đã tạo thành công file ZIP: ${zipFile} (${sizeKB} KB - sạch 100%, không chứa node_modules)`);
