const bcrypt = require('bcrypt');

const plainPassword = 'test1234';
const storedHash = '$2b$10$N9qo8uLOickgx2ZMRZoMye7VXxPPQfS/X1G7MwPFBNGN8BQTJP.1i';

async function testPassword() {
  console.log('Testing password:', plainPassword);
  console.log('Against hash:', storedHash);

  const isValid = await bcrypt.compare(plainPassword, storedHash);
  console.log('Password valid:', isValid);

  // Also generate a new hash to compare
  const newHash = await bcrypt.hash(plainPassword, 10);
  console.log('\nNew hash for same password:', newHash);

  const isNewValid = await bcrypt.compare(plainPassword, newHash);
  console.log('New hash valid:', isNewValid);
}

testPassword().catch(console.error);
