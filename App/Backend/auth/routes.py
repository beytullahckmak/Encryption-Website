from flask import Flask,request,jsonify
import sqlite3
from . import auth_bp
from .security import hash_password,verify_password 

@auth_bp.route('/register', methods=['GET'])
def show_register_page():
    return jsonify({"message": "Register page loaded successfully!"}), 200

@auth_bp.route('/register',methods = ['POST'])
def register_user():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    hashed_password = hash_password(password)
    
    if not email or not password or not username:
        return jsonify({"error": "E-posta ve şifre gereklidir!"}), 400
    
    try:    
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO users(username,email,password) VALUES(?,?,?)''',(username,email,hashed_password))
        
        conn.commit()
        conn.close()
        return jsonify({"message": "Kayıt Başarılı","username":username}) ,201
    except sqlite3.IntegrityError:
        return jsonify({"message": "Bu kullanıcı adı zaten kullanılıyor "}),409
    except Exception as e:
            return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500

@auth_bp.route('/login',methods=['GET'])
def show_login_page():
    return jsonify({"message": "Login page loaded successfully!"}),200

@auth_bp.route('/login',methods=['POST'])
def login_user():
    email = request.form['email']
    password = request.form['password']
    
    if not email or not password:
        return jsonify({"error": "E-posta ve şifre gereklidir!"}), 400
    try:
        connect = sqlite3.connect('app.db')
        cursor = connect.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()

        if user and verify_password(password, user[3]):
            return jsonify({"message": "Giriş başarılı!", "username": user[1]}), 200
        else:
            return jsonify({"error": "E-posta veya şifre hatalı."}), 401
        
        connect.commit()
        connect.close()
        if user:
            return jsonify({"message": "Giriş başarılı!", "username": user[1]}), 200
        else:
            return jsonify({"error": "E-posta veya şifre hatalı."}), 401
    except sqlite3.IntegrityError:
        return jsonify({"message": "Bu kullanıcı adı zaten kullanılıyor "}),409
    except Exception as e:
            return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500