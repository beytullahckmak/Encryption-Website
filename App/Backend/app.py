from flask import Flask,jsonify,session
from database import init_db  # Veritabanını başlatmak için init_db fonksiyonu ekleniyor
from auth import auth_bp
import secrets
import string
from flask_session import Session



app = Flask(__name__)

app.secret_key="LtWFAlkN/HIlq6U2W4nAbQ"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.register_blueprint(auth_bp)

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

@app.route('/strong-password', methods=['GET'])
def generate_password_endpoint():
    try:
        password = generate_password()
        return jsonify({"password": password,"status":"success"}),200
    except Exception as e:
        return jsonify({"error": "Şifre oluşturulurken bir hata oluştu.", "details": str(e), "status": "error"}), 500


if __name__ == "__main__":
    init_db()  
    app.run(debug=True)