from flask_restx import Namespace, Resource

demo = Namespace('demo', description='Demo operations')

@demo.route('/demo')
class DemoEndpoint(Resource):
    def get(self):
        return {"message": "This is a demo endpoint."}
