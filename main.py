import uvicorn
from app.app import app
from dotenv import load_dotenv
import os

# Load environment variables from .env file or from docker-compose.yml
load_dotenv()

# Get configuration from environment variables
PORT = int(os.getenv("PORT", 8678))
SERVER_IP = os.getenv("SERVER_IP")

if __name__ == "__main__":
    if SERVER_IP:
        # If SERVER_IP is provided, use it for forwarded_allow_ips
        uvicorn.run(app, host="0.0.0.0", port=PORT, forwarded_allow_ips=[SERVER_IP])
    else:
        # If SERVER_IP is not provided, just run without forwarded_allow_ips
        uvicorn.run(app, host="0.0.0.0", port=PORT)
