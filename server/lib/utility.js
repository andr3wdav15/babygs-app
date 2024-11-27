import bcrypt from 'bcrypt';
import PasswordValidator from 'password-validator';

// hash the password
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    console.log(hash);
    return hash;
}

// validate the password
async function comparePassword(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
}

// create a schema
const schema = new PasswordValidator();
schema
    .is().min(8)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)

// validate the password with schema
function validatePassword(password) {
    return schema.validate(password, { list: true });
}

export { hashPassword, comparePassword, validatePassword };