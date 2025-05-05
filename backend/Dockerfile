FROM python:3.9-slim

# Install dependencies
RUN pip install paho-mqtt boto3

# Copy the processing script
COPY process_data.py /app/process_data.py

# Set working directory
WORKDIR /app

# Run the script
CMD ["python", "process_data.py"]