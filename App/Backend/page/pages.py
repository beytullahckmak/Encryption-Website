import sqlite3
from . import page_bp
from flask import Flask,request,jsonify,session
from flask_session import Session

@page_bp.route('/passwords', methods=['GET'])
def get_passwords():
    if 'user_id' not in session:
        print(f"Session data: {session}")  # Session bilgilerini loglayın
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session.get['user_id']
    
    try:
        conn = sqlite3.connect('app.db', timeout=10)
        conn.row_factory = sqlite3.Row  # Burada `row_factory`'yi sözlük gibi kullanıyoruz
        cursor = conn.cursor()
        
        # Kullanıcının parolalarını getir
        cursor.execute("""
            SELECT id, password_name, secure_password FROM passwords WHERE user_id = ?
        """, (user_id,))
        passwords = cursor.fetchall()

        if not passwords:
            return jsonify({"message": "Henüz parola eklenmemiş."}), 200

        password_list = []
        for password in passwords:
            password_list.append({
                "id": password["id"],  # Burada sözlük gibi indeksleme yapılabilir
                "password_name": password["password_name"],
                "secure_password": password["secure_password"]
            })

        conn.close()

        return jsonify({"passwords": password_list}), 200
    except Exception as e:
        return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500
@page_bp.route('/add', methods=['POST'])
def add_password():
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session['user_id']
    password_name = request.form['password_name']
    secure_password = request.form['secure_password']

    if not password_name or not secure_password:
        return jsonify({"error": "Parola adı ve güvenli parola gereklidir."}), 400

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO passwords (user_id, password_name, secure_password)
        VALUES (?, ?, ?)
        """, (user_id, password_name, secure_password))
        conn.commit()

        return jsonify({"message": "Parola başarıyla eklendi!"}), 201
    except Exception as e:
        return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500

@page_bp.route('/update/<int:password_id>', methods=['PUT'])
def update_password(password_id):
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session['user_id']
    new_password = request.form['secure_password']

    if not new_password:
        return jsonify({"error": "Yeni güvenli parola gereklidir."}), 400

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()

        # Parola kaydını kontrol et
        cursor.execute("""
            SELECT * FROM passwords WHERE id = ? AND user_id = ?
        """, (password_id, user_id))
        password = cursor.fetchone()

        if password is None:
            return jsonify({"error": "Bu parolayı güncelleyemezsiniz. Parola bulunamadı veya yetkisiz erişim."}), 404

        cursor.execute("""
            UPDATE passwords SET secure_password = ? WHERE id = ? AND user_id = ?
        """, (new_password, password_id, user_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Parola başarıyla güncellendi!"}), 200
    except Exception as e:
        return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500

@page_bp.route('/delete/<int:password_id>', methods=['DELETE'])
def delete_password(password_id):
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session['user_id']

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()

        # Parola kaydını kontrol et
        cursor.execute("""
            SELECT * FROM passwords WHERE id = ? AND user_id = ?
        """, (password_id, user_id))
        password = cursor.fetchone()

        if password is None:
            return jsonify({"error": "Bu parolayı silemezsiniz. Parola bulunamadı veya yetkisiz erişim."}), 404

        cursor.execute("""
            DELETE FROM passwords WHERE id = ? AND user_id = ?
        """, (password_id, user_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Parola başarıyla silindi!"}), 200
    except Exception as e:
        return jsonify({"error": "Bir hata oluştu.", "details": str(e)}), 500
