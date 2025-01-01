import uvicorn
from fastapi import FastAPI, Request

# Initialize FastAPI app
app = FastAPI()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8678)
