from flask import Flask
from database import init_db  # Veritabanını başlatmak için init_db fonksiyonu ekleniyor
from auth import auth_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)

if __name__ == "__main__":
    init_db()  
    app.run(debug=True)