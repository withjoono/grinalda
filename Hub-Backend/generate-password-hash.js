const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'test1234';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const fullHash = '{bcrypt}' + hash;

  console.log('Password:', password);
  console.log('BCrypt Hash:', hash);
  console.log('Full Hash (with prefix):', fullHash);

  // 검증
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification:', isValid ? 'PASS' : 'FAIL');
}

generateHash().catch(console.error);
