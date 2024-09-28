from flask import Flask, request, jsonify, render_template
import mysql.connector
import pandas as pd
from web3 import Web3
import json

app = Flask(__name__)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Replace with your MySQL username
    password="root",  # Replace with your MySQL password
    database="spa_reservas_bd"
)

# Blockchain connection (Ethereum testnet via Infura or local node)
#w3 = Web3(Web3.HTTPProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID'))  # Replace with your Ethereum node provider
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
contract_address = '0x07f0FCC8fa92f3DAFa454a097A7b988092Ca0909'  # Replace with your deployed contract address

# Load contract ABI (replace with your contract's ABI)
with open('contract_abi.json', 'r') as f:
    contract_abi = json.load(f)

contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Load questions from CSV
questions = pd.read_csv('questions.csv')

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html') 


@app.route('/getQuestions', methods=['GET'])
def get_questions():
    return jsonify(questions.to_dict(orient='records'))


@app.route('/reservation', methods=['POST'])
def save_reservation():
    data = request.json  # Ensure you are sending JSON data in the body
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("¿Cual es tu nombre?")
    age = data.get("¿Cuantos años tienes?")
    service = data.get("¿Cual es el servicio que quieres reservar?")
    time = data.get("¿A que hora quieres reservar?")
    date = data.get("¿Cuando quieres agendar la cita?")

    if not name or not age or not service or not time or not date:
        return jsonify({"error": "Missing required fields"}), 400

    # Save data to MySQL
    cursor = db.cursor()
    query = "INSERT INTO spa_reservaciones (nombre, edad, servicio_solicitado, hora_reservacion, fecha_reservacion) VALUES (%s, %s, %s, %s, %s)"
    values = (name, age, service, time, date)
    cursor.execute(query, values)
    db.commit()

    # Blockchain record: Register the reservation on the blockchain
    tx_hash = contract.functions.registerReservation(
        name,
        age,
        service,
        time,
        date
    ).transact({'from': w3.eth.accounts[0]})

    return jsonify({
        "message": "Reservation saved successfully",
        "data": {
            "name": name,
            "age": age,
            "service": service,
            "time": time,
            "date": date
        }
    }), 200

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Flask is running!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=True)
