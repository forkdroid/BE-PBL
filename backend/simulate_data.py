import paho.mqtt.client as mqtt
from faker import Faker
import json
import time

# MQTT Broker Details
broker = "broker.hivemq.com"
port = 1883
topic = "air-quality/data"

# Initialize Faker
fake = Faker()

# Generate fake air quality data
def generate_air_quality_data():
    return {
        "timestamp": int(time.time()),
        "location": fake.city(),
        "pm2_5": fake.random_int(min=0, max=300),
        "pm10": fake.random_int(min=0, max=500),
        "co2": fake.random_int(min=300, max=2000),
        "temperature": fake.random_int(min=-10, max=40),
        "humidity": fake.random_int(min=0, max=100)
    }

# MQTT Client
client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with code {rc}")

client.on_connect = on_connect
client.connect(broker, port, 60)

# Publish data every 5 seconds
while True:
    data = generate_air_quality_data()
    client.publish(topic, json.dumps(data))
    print(f"Published: {data}")
    time.sleep(5)