// backend/src/generate-hash.js
import bcrypt from 'bcryptjs';

const passwords = [
  { email: 'hr.callbackcrew@gmail.com', password: 'callback2026project' },
  { email: 'admin@jurisflow.com', password: 'wakeel2026jurisflow' }
];

async function generateHashes() {
  console.log('=== GENERATE BCRYPT HASHES ===\n');
  for (const p of passwords) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(p.password, salt);
    console.log(`Email: ${p.email}`);
    console.log(`Password: ${p.password}`);
    console.log(`HASH: ${hash}`);
    console.log('---\n');
  }
}

generateHashes();