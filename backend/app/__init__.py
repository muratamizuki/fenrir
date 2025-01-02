from flask import Flask
from flask_restx import Api
from .routes.demo import demo_ns

def create_app():
    app = Flask(__name__)
    api = Api(app)
    api.add_namespace(demo_ns, path='/demo')
    return app