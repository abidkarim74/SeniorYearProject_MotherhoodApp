from passlib.context import CryptContext


pwd_context = CryptContext(
    schemes=['bcrypt'],
    deprecated='auto'
)

def hash_password_func(password: str):
    print("111111111")
    hashed_password = pwd_context.hash(password)
    print("222222222222")
    return hashed_password


def verify_password(plain_password: str, secret_password: str):
    is_match = pwd_context.verify(plain_password, secret_password)
    return is_match