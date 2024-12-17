from flask import Blueprint

# Blueprint oluştur
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Route'ları import et
from . import routes