// npm i bcrypt
import bcrypt from 'bcryptjs';
const hash = '$2b$10$CICxaP8WlS8azu9LxRSnyeCOuSMJBa.vV2r5Q/m9hjej97NEJVU8i';

// Single candidate
async function checkCandidate(candidate) {
  const ok = await bcrypt.compare(candidate, hash);
  console.log(candidate, ok ? 'MATCH' : 'no match');
}

checkCandidate('your-guess-here');

// Or test an array of candidates (your personal known passwords)
async function checkList(candidates) {
  for (const c of candidates) {
    if (await bcrypt.compare(c, hash)) {
      console.log('Found password:', c);
      return;
    }
  }
  console.log('No candidate matched.');
}
