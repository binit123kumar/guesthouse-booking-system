const bcrypt = require('bcryptjs'); 

async function createHash() {
  const plainPassword = '123';
  const saltRounds = 10; 

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log(hashedPassword);
  } catch (error) {
    console.error(error);
  }
}

createHash();