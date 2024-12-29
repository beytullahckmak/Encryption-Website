import sqlite3
from flask import Blueprint, request, jsonify, session, current_app as app

# Blueprint tanımlaması
page_bp = Blueprint('page_bp', __name__)

# Kullanıcının parolalarını getirme
@page_bp.route('/passwords', methods=['GET'])
def get_passwords():
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session.get('user_id')

    try:
        conn = sqlite3.connect('app.db', timeout=10)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, password_name, secure_password FROM passwords WHERE user_id = ?", (user_id,))
        passwords = cursor.fetchall()

        password_list = [
            {"id": row["id"], "password_name": row["password_name"], "secure_password": row["secure_password"]}
            for row in passwords
        ]

        if not password_list:
            return jsonify({"message": "Henüz parola eklenmemiş."}), 200

        return jsonify({"passwords": password_list}), 200
    except Exception as e:
        app.logger.error(f"Hata oluştu: {e}")
        return jsonify({"error": "Bir hata oluştu. Lütfen tekrar deneyin."}), 500
    finally:
        conn.close()

# Yeni parola ekleme
@page_bp.route('/add', methods=['POST'])
def add_password():
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session.get('user_id')
    data = request.json
    password_name = data.get('password_name')
    secure_password = data.get('secure_password')

    if not password_name or not secure_password:
        return jsonify({"error": "Parola adı ve güvenli parola gereklidir."}), 400

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO passwords (user_id, password_name, secure_password) VALUES (?, ?, ?)",
            (user_id, password_name, secure_password),
        )
        conn.commit()
        return jsonify({"message": "Parola başarıyla eklendi!"}), 201
    except Exception as e:
        app.logger.error(f"Hata oluştu: {e}")
        return jsonify({"error": "Bir hata oluştu. Lütfen tekrar deneyin."}), 500
    finally:
        conn.close()

# Parola güncelleme
@page_bp.route('/update/<int:password_id>', methods=['PUT'])
def update_password(password_id):
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session.get('user_id')
    data = request.json
    new_password = data.get('secure_password')

    if not new_password:
        return jsonify({"error": "Yeni güvenli parola gereklidir."}), 400

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM passwords WHERE id = ? AND user_id = ?", (password_id, user_id))
        password = cursor.fetchone()

        if password is None:
            return jsonify({"error": "Parola bulunamadı veya yetkisiz erişim."}), 404

        cursor.execute(
            "UPDATE passwords SET secure_password = ? WHERE id = ? AND user_id = ?",
            (new_password, password_id, user_id),
        )
        conn.commit()
        return jsonify({"message": "Parola başarıyla güncellendi!"}), 200
    except Exception as e:
        app.logger.error(f"Hata oluştu: {e}")
        return jsonify({"error": "Bir hata oluştu. Lütfen tekrar deneyin."}), 500
    finally:
        conn.close()

# Parola silme
@page_bp.route('/delete/<int:password_id>', methods=['DELETE'])
def delete_password(password_id):
    if 'user_id' not in session:
        return jsonify({"error": "Yetkisiz erişim. Lütfen giriş yapın."}), 401

    user_id = session.get('user_id')

    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM passwords WHERE id = ? AND user_id = ?", (password_id, user_id))
        password = cursor.fetchone()

        if password is None:
            return jsonify({"error": "Parola bulunamadı veya yetkisiz erişim."}), 404

        cursor.execute("DELETE FROM passwords WHERE id = ? AND user_id = ?", (password_id, user_id))
        conn.commit()
        return jsonify({"message": "Parola başarıyla silindi!"}), 200
    except Exception as e:
        app.logger.error(f"Hata oluştu: {e}")
        return jsonify({"error": "Bir hata oluştu. Lütfen tekrar deneyin."}), 500
    finally:
        conn.close()