from flask import Flask,request,jsonify,session
import sqlite3
from . import auth_bp
from .security import hash_password,verify_password 
from datetime import datetime, timedelta
from flask_session import Session


@auth_bp.route('/register', methods=['GET'])
def show_register_page():
    return jsonify({"message": "Register page loaded successfully!"}), 200

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.json  # JSON formatında gelen veriyi alın
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Tüm alanlar doldurulmalıdır!"}), 400

    hashed_password = hash_password(password)

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute(
            '''INSERT INTO users(username, email, password) VALUES (?, ?, ?)''',
            (username, email, hashed_password)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Kayıt başarılı", "username": username}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "Bu kullanıcı adı zaten kullanılıyor."}), 409
    except Exception as e:
        return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500

@auth_bp.route('/login',methods=['GET'])
def show_login_page():
    return jsonify({"message": "Login page loaded successfully!"}),200

@auth_bp.route('/login', methods=['POST'])
def login_user():
    if request.content_type != 'application/json':
        return jsonify({"error": "Geçersiz içerik türü. Lütfen JSON formatında veri gönderin."}), 415
    
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "E-posta ve şifre gereklidir!"}), 400
    
    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()

        if user and verify_password(password, user[3]):  # Şifre doğrulama
            session['user_id'] = user[0]  # Kullanıcı ID'sini session'a ekliyoruz
            session['username'] = user[1]  # Kullanıcı adını session'a ekliyoruz
            return jsonify({
                "message": "Giriş başarılı!",
                "username": user[1],
                "session": session['user_id']
            }), 200
        else:
            return jsonify({"error": "E-posta veya şifre hatalı."}), 401
    except Exception as e:
        print(f"Hata detayları: {e}")
        return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500
@auth_bp.route('/protected', methods=['GET'])
def protected_route():
    if 'user_id' not in session:  # Oturumda user_id yoksa yetkisiz
        return jsonify({"error": "Yetkisiz erişim"}), 401
    
    return jsonify({"message": f"Merhaba, {session['username']}! Bu korunan bir rota."}), 200

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    username = session.get('username')
    print(f"Session Username: {username}")  # Debug logu
    if username:
        return jsonify({"isLoggedIn": True, "username": username}), 200
    else:
        return jsonify({"isLoggedIn": False}), 401
    
@auth_bp.route('/get-session', methods=['GET'])
def get_session():
    print(session);
    if 'user_id' in session:
        return jsonify({
            'user_id': session['user_id'],
            'username': session['username']
        }), 200
    else:
        return jsonify({'error': 'Session bulunamadı'}), 401