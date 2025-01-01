# demoって名前はややこしいかも
from flask_restx import Namespace, Resource

demo_ns = Namespace('demo')

@demo_ns.route('/')
class DemoResource(Resource):
    def get(self):
        return {"message": "Hello!"}