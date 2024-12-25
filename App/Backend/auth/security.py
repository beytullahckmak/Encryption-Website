import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()  # Rastgele bir salt oluşturur
    hashed = bcrypt.hashpw(password.encode(), salt)  # Şifreyi hashler
    return hashed.decode()  # String olarak döner

# Şifre doğrulama fonksiyonu
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
