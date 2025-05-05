# Air Quality Dashboard with Docker Backend

This setup connects your React frontend to a Python backend running in Docker that simulates air quality sensor data.

## Architecture

![Architecture Diagram](https://mermaid.ink/img/pako:eNplkMFqwzAMhl9F-NRBn8A9dLSUQUt3Wr2LsRQvxLaDpQyS9N2npZSxnaST_n_f_wueHUDhAOfYhFbTsVTrWmnhLtTqHbXGnCLebqBLyM5NN_K7ZzeBapYcQhRqe6KJa4kBVW9SonD-0-GWp5V-5-Qu_eJGDgPa4Jw7Ey5Q-KF1KL4iN9Eju9Sp6_hD8X3PEk9uGa9oyhkK1LF6i3P1Zc8yZZkLPBQpG3qIWC5YPTGOqGGFDDKiDwVelHLoPeEKJSt_X-OMXx6Hn77BEKUVjMBKuUlJCQ4afbRgMVjyeDIY4RKsH_8ALPNpBA)

1. **Python Backend (Docker)**
   - FastAPI with WebSocket support
   - Simulates sensor data from MQ135 and others
   - Updates values every 15 seconds
   - Runs in Docker container

2. **React Frontend**
   - Connects to backend via WebSocket
   - Displays real-time sensor data
   - Handles reconnection if connection drops
   - Shows alerts based on thresholds

## How to Run

### Using Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed on your system
2. Run the following command from the project root:

```bash
docker-compose up
```

3. Access the dashboard at http://localhost:3000
4. The backend API docs are available at http://localhost:8000/docs

### Manual Setup

#### Backend (Python/FastAPI)

1. Go to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

#### Frontend (React)

1. Add the WebSocket URL to your .env file:
```
REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws
```

2. Install dependencies and start the React app:
```bash
npm install
npm start
```

## How It Works

1. The Python backend starts a WebSocket server and sends simulated sensor data
2. The React frontend connects to this WebSocket endpoint
3. When the backend sends data, the frontend updates the dashboard in real-time
4. If the connection drops, the frontend automatically tries to reconnect

## Data Format

The backend sends data in this format:

```json
{
  "timestamp": "2023-05-01T12:34:56.789Z",
  "data": [
    {
      "id": "nh3",
      "name": "NH3",
      "fullName": "Ammonia",
      "value": 25.6,
      "unit": "ppb",
      "threshold": {
        "good": 50,
        "moderate": 100,
        "unhealthy": 150
      },
      ...
    },
    ...more pollutants
  ]
}
```

## Customizing

### Changing Update Frequency

To change how often the backend sends updates, modify the `asyncio.sleep()` value in `backend/app.py`.

### Adding Real Sensor Data

Replace the random data generation in `generate_sensor_data()` with code that reads from actual sensors.

### Modifying Pollutants

Edit the `sensor_data` array in `backend/app.py` to change which pollutants are monitored. 