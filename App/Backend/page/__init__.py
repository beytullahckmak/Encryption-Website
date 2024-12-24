from flask import Blueprint

# Blueprint oluştur
page_bp = Blueprint('page', __name__, url_prefix='/page')

# Route'ları import et
from . import pages