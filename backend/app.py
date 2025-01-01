from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# デバック用のエンドポイント
@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    selected_labels = data.get('selectedLabels', [])
    additional_info = data.get('additionalInfo', '')

    print("受信したデータ:")
    print("選択されたラベル:", selected_labels)
    print("追加情報:", additional_info)

    return jsonify({"message": "データが正常に受信されました"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
