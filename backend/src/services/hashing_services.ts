import bcrypt from 'bcrypt';


export const hash_password_func = async (plainPassword: String) => {
  const saltRounds = 10;
  const converted = String(plainPassword);
  const hashedPassword = await bcrypt.hash(converted, saltRounds);

  return hashedPassword;
}


export const verify_password = async (plain_password: string, secret_password: string) => {
  const match = await bcrypt.compare(plain_password, secret_password);
  
  return match;
}