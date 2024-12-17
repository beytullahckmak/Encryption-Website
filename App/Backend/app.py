from flask import Flask
from database import init_db  # Veritabanını başlatmak için init_db fonksiyonu ekleniyor

app = Flask(__name__)

if __name__ == "__main__":
    # Veritabanını başlat
    init_db()  # Bu fonksiyon yalnızca tablo yoksa tabloyu oluşturur
    app.run(debug=True)