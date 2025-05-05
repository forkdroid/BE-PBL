from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

# Mock data to simulate pollutants and their thresholds
POLLUTANTS = [
    {
        "id": "pm2_5",
        "name": "PM2.5",
        "unit": "µg/m³",
        "threshold": {
            "good": 12,
            "moderate": 35.4,
            "unhealthy": 55.4
        }
    },
    {
        "id": "pm10",
        "name": "PM10",
        "unit": "µg/m³",
        "threshold": {
            "good": 50,
            "moderate": 100,
            "unhealthy": 150
        }
    },
    {
        "id": "co",
        "name": "CO",
        "unit": "ppm",
        "threshold": {
            "good": 4.4,
            "moderate": 9.4,
            "unhealthy": 12.4
        }
    },
    {
        "id": "no2",
        "name": "NO₂",
        "unit": "ppb",
        "threshold": {
            "good": 53,
            "moderate": 100,
            "unhealthy": 360
        }
    },
    {
        "id": "so2",
        "name": "SO₂",
        "unit": "ppb",
        "threshold": {
            "good": 35,
            "moderate": 75,
            "unhealthy": 185
        }
    },
    {
        "id": "o3",
        "name": "O₃",
        "unit": "ppb",
        "threshold": {
            "good": 54,
            "moderate": 70,
            "unhealthy": 85
        }
    },
]

@app.route('/api/aqi', methods=['GET'])
def get_mock_aqi():
    mock_data = []

    for pollutant in POLLUTANTS:
        current_value = round(
            random.uniform(
                pollutant["threshold"]["good"] * 0.8,  # Slightly below good
                pollutant["threshold"]["unhealthy"] * 1.2  # Slightly above unhealthy
            ), 2
        )

        pollutant_data = {
            "id": pollutant["id"],
            "name": pollutant["name"],
            "unit": pollutant["unit"],
            "value": current_value,
            "threshold": pollutant["threshold"]
        }

        mock_data.append(pollutant_data)

    return jsonify(mock_data)

if __name__ == '__main__':
    print("✅ API server running at http://127.0.0.1:5000/api/aqi")
    app.run(debug=True)
