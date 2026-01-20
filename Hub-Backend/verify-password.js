const bcrypt = require('bcrypt');

async function verifyPassword() {
  const password = 'test1234';
  const storedHash = '{bcrypt}$2b$10$/t3FmMMSGoInVMxdRkiFq.jp1/4ppnw1PqRS.5Ohmr6tShjAl1ZBm';

  const hashWithoutPrefix = storedHash.startsWith('{bcrypt}')
    ? storedHash.slice('{bcrypt}'.length)
    : storedHash;

  console.log('Password:', password);
  console.log('Hash (without prefix):', hashWithoutPrefix);

  const isValid = await bcrypt.compare(password, hashWithoutPrefix);
  console.log('Verification:', isValid ? 'PASS ✅' : 'FAIL ❌');
}

verifyPassword().catch(console.error);
