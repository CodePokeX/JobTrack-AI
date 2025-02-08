const bcrypt = require("bcryptjs");

async function regenerateHash() {
    const password = "123456"; // Your password

    // Generate a new hash
    const newHash = await bcrypt.hash(password, 10);
    console.log("New Hash:", newHash);

    // Compare newly generated hash with itself (should be true)
    const isMatch = await bcrypt.compare(password, newHash);
    console.log("Passwords Match?", isMatch);
}

regenerateHash();
