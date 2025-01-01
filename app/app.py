from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from app.helper import fetch_interfaces, format_bytes

# Initialize FastAPI app
app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Fetch data from the database
    interfaces = fetch_interfaces()

    for interface in interfaces:
        interface["rxtotal"] = format_bytes(interface["rxtotal"])
        interface["txtotal"] = format_bytes(interface["txtotal"])
        interface["alltime"] = format_bytes(interface["alltime"])
        interface["active"] = True if interface["active"] == 1 else False

    return templates.TemplateResponse("index.html", {"request": request, "interfaces": interfaces})
