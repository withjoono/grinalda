const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, '..', 'dist', 'main.js');

console.log('Checking build status...');

if (!fs.existsSync(distPath)) {
  console.log('⚠️  Build not found, building now...');
  console.log('Running: npx tsc && npx tsc-alias');

  try {
    execSync('npx tsc && npx tsc-alias', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Build complete');
  } catch (error) {
    console.error('❌ Build failed');
    process.exit(1);
  }
} else {
  console.log('✅ Build exists');
}
