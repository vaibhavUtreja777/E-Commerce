
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from app import responseGenerator,csv_to_json
application = Flask(__name__)

application.config['CORS_HEADERS'] = 'Content-Type'
application.config['SECRET_KEY'] = 'SecretKey'
CORS(application , resources={r"/foo": {"origins": "*"}})


@application.route('/', methods = ['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def home():
    if(request.method == 'POST'):
        message = request.form['message']
        print(message)
        return jsonify(responseGenerator(message))

@application.route('/product', methods = ['GET'])
@cross_origin()
def getProducts():
    if(request.method == 'GET'):
        databases = ["Men_TopWear" , "Men_BottomWear" , "Men_EthnicSets", "Men_Shoes" , "Women_Topwear" , "Women_EthnicWear", "Women_Jewellery"]
        data = {}
        for db in databases :
            dbConsumed = csv_to_json(f'C:/Users/Yatin/Downloads/L2-Submission-Ultra-Instinct/E-Commerce/code/data/{db}.csv')
            data[db] = dbConsumed
        return jsonify(data)

@application.route('/product/<db>/<id>', methods = ['GET'])
@cross_origin()
def getProductsById(db,id):
    if(request.method == 'GET'):
        databases = ["Men_TopWear" , "Men_BottomWear" , "Men_EthnicSets", "Men_Shoes" , "Women_Topwear" , "Women_EthnicWear" , "Women_Jewellery"]
        if db not in databases:
            return jsonify({"ErrorMessage" : "invalidDB"})
        dbConsumed = csv_to_json(f'C:/Users/Yatin/Downloads/L2-Submission-Ultra-Instinct/E-Commerce/code/data/{db}.csv')
        data = dbConsumed
        if(int(id) >= len(data) or int(id) < 0):
            return jsonify({"ErrorMessage" : "invalidIndex"})
        return jsonify(data[int(id)])

if __name__ == '__main__':
	application.run(debug = True)
