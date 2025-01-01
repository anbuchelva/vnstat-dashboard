import uvicorn
from app.config import PORT
from app.app import app

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=PORT)
