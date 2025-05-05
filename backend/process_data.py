import paho.mqtt.client as mqtt
import time
import logging
import json
from datetime import datetime
import os

import boto3

# Load environment variables


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mqtt_service")

# MQTT Broker Details
broker = "broker.hivemq.com"
port = 1883
topic = "PBL/sensor674/#"

PM2_5_THRESHOLD = 100
s3_bucket = "fog-node-data"
s3_client = boto3.client('s3', aws_access_key_id='', aws_secret_access_key='')


def calculate_indian_aqi(pollutant_name, concentration):
    """
    - µg/m³ for PM2.5
    - ppm for gases (CO2, NH3, Alcohol, Benzene)
    """
    breakpoints = {
        'pm2_5': [  # µg/m³ (Indian standard)
            (0, 30, 0, 50),     # Good
            (31, 60, 51, 100),   # Satisfactory
            (61, 90, 101, 200),  # Moderate
            (91, 120, 201, 300), # Poor
            (121, 250, 301, 400),# Very Poor
            (251, 500, 401, 500) # Severe
        ],
        'co2': [  # ppm (Indian std not available, using WHO/ASHRAE)
            (0, 450, 0, 50),     # Good (outdoor avg)
            (451, 1000, 51, 100), # Satisfactory (indoor threshold)
            (1001, 2000, 101, 200), # Moderate
            (2001, 5000, 201, 300), # Poor
            (5001, 10000, 301, 400), # Very Poor
            (10001, 50000, 401, 500) # Severe
        ],
        'nh3': [  # ppm (Indian industrial std: 25ppm over 8hr)
            (0, 0.1, 0, 50),      # Good
            (0.11, 0.5, 51, 100), # Satisfactory
            (0.51, 1, 101, 200),  # Moderate
            (1.1, 5, 201, 300),   # Poor
            (5.1, 15, 301, 400),  # Very Poor
            (15.1, 35, 401, 500)  # Severe
        ],
        'alcohol': [  # ppm (Ethanol, no Indian std)
            (0, 0.05, 0, 50),     # Good
            (0.051, 0.1, 51, 100), # Satisfactory
            (0.101, 0.3, 101, 200), # Moderate
            (0.301, 1, 201, 300),   # Poor
            (1.1, 5, 301, 400),     # Very Poor
            (5.1, 10, 401, 500)     # Severe
        ],
        'benzene': [  # ppm (Indian annual avg std: 0.005ppm)
            (0, 0.002, 0, 50),     # Good
            (0.0021, 0.005, 51, 100), # Satisfactory
            (0.0051, 0.01, 101, 200), # Moderate
            (0.011, 0.1, 201, 300),    # Poor
            (0.101, 0.5, 301, 400),    # Very Poor
            (0.501, 5, 401, 500)       # Severe
        ],
        'smoke': [  # ppm (No Indian std, using PM1 proxy)
            (0, 0.02, 0, 50),      # Good
            (0.021, 0.05, 51, 100), # Satisfactory
            (0.051, 0.1, 101, 200), # Moderate
            (0.101, 0.2, 201, 300), # Poor
            (0.201, 0.5, 301, 400), # Very Poor
            (0.501, 1, 401, 500)    # Severe
        ]
    }

    if pollutant_name == 'benzene':
        concentration = concentration / 1000  # Convert ppb to ppm for calculation
    for (c_low, c_high, aqi_low, aqi_high) in breakpoints[pollutant_name]:
        if c_low <= concentration <= c_high:
            return round(((aqi_high - aqi_low) / (c_high - c_low)) * (concentration - c_low) + aqi_low)
    return 500

# Process and store data
def process_and_store(data):

    results = {poll: calculate_indian_aqi(poll.replace('2.5', '2_5'), conc)
          for poll, conc in data.items()}
    dominant = max(results, key=results.get)

    val = {'timestamp': data["timestamp"], 'aqi': results[dominant]}
    return val

def upload_to_s3(val):

    key = f"air-quality-data/{val['timestamp']}.json"

    # Upload the file to S3
    try:
        s3_client.upload_file("/app/data/air_quality_data.json", s3_bucket, key)
        print(f"Uploaded daily data to S3: {key}")

        # Clear the local file after upload
        os.remove("/app/data/air_quality_data.json")
        print("Local data file cleared.")
    except Exception as e:
        print(f"Failed to upload to S3: {e}")

client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    logging.info("Connected to MQTT Broker with code %s", rc)
    client.subscribe(topic)

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload)
        print(f"Received: {data}")
        # Log the received data
        logging.info(f"Received data: {data}")
        val = process_and_store(data)
        upload_to_s3(val)
        # process_and_store(data)
    except json.JSONDecodeError:
        logging.error("Failed to decode JSON message")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")

client.on_connect = on_connect
client.on_message = on_message

client.connect(broker, port, 60)

# Keep the script running
client.loop_forever()
