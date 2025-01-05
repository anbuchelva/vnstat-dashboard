from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from app.helper import fetch_interfaces, format_bytes, fetch_statistics

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

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "interfaces": interfaces,
            "interface_url": None,
            "interface_menu": True,
        },
    )


@app.get("/interface/{interface_name}", response_class=HTMLResponse)
async def interface(request: Request, interface_name: str):
    interfaces = fetch_interfaces()

    try:
        interface_id = next(interface["id"] for interface in interfaces if interface["name"] == interface_name)
        interface_url = request.url_for("interface", interface_name=interface_name)
        interface_menu = True
    except StopIteration:
        interface_id = None
        interface_url = None
        interface_menu = False

    # Get the current time and the time 24 hours ago
    now = datetime.now()
    five_minutes_delta = now - timedelta(hours=2)
    twenty_four_hours_ago = now - timedelta(hours=24)
    thiry_days_ago = now - timedelta(days=30)
    twelve_months_ago = now - relativedelta(months=12)

    statistics = fetch_statistics(interface_id)

    # data for charts
    fiveminute_data = statistics.get("fiveminute", [])
    hour_data = statistics.get("hour", [])
    day_data = statistics.get("day", [])
    month_data = statistics.get("month", [])
    year_data = statistics.get("year", [])
    top_data = statistics.get("top", [])

    # filter data
    recent_fiveminute_data = [entry for entry in fiveminute_data if entry["date"] >= five_minutes_delta]
    recent_hour_data = [entry for entry in hour_data if entry["date"] >= twenty_four_hours_ago]
    recent_day_data = [entry for entry in day_data if entry["date"] >= thiry_days_ago]
    recent_month_data = [entry for entry in month_data if entry["date"] >= twelve_months_ago]

    # Prepare the labels (dates) and the corresponding data for rx and tx
    five_min_labels = [entry["date"].strftime("%Y-%m-%d %H:%M") for entry in recent_fiveminute_data]
    five_min_received_data = [entry["rx"] for entry in recent_fiveminute_data]
    five_min_sent_data = [entry["tx"] for entry in recent_fiveminute_data]

    hour_labels = [entry["date"].strftime("%Y-%m-%d %H:%M") for entry in recent_hour_data]
    hour_received_data = [entry["rx"] for entry in recent_hour_data]
    hour_sent_data = [entry["tx"] for entry in recent_hour_data]

    day_labels = [entry["date"].strftime("%Y-%m-%d %H:%M") for entry in recent_day_data]
    day_received_data = [entry["rx"] for entry in recent_day_data]
    day_sent_data = [entry["tx"] for entry in recent_day_data]

    month_labels = [entry["date"].strftime("%Y-%m-%d %H:%M") for entry in recent_month_data]
    month_received_data = [entry["rx"] for entry in recent_month_data]
    month_sent_data = [entry["tx"] for entry in recent_day_data]

    year_labels = [entry["date"].strftime("%Y-%m-%d %H:%M") for entry in year_data]
    year_received_data = [entry["rx"] for entry in year_data]
    year_sent_data = [entry["tx"] for entry in year_data]

    top_labels = [entry["date"].strftime("%Y-%m-%d %H:%M") for entry in top_data][1:]
    top_received_data = [entry["rx"] for entry in top_data][1:]
    top_sent_data = [entry["tx"] for entry in top_data][1:]

    # print(statistics)

    return templates.TemplateResponse(
        "interface.html",
        {
            "request": request,
            "interfaces": interfaces,
            "interface_name": interface_name,
            "interface_url": interface_url,
            "statistics": statistics,
            "interface_menu": interface_menu,
            "five_min_labels": five_min_labels,
            "five_min_received_data": five_min_received_data,
            "five_min_sent_data": five_min_sent_data,
            "hour_labels": hour_labels,
            "hour_received_data": hour_received_data,
            "hour_sent_data": hour_sent_data,
            "day_labels": day_labels,
            "day_received_data": day_received_data,
            "day_sent_data": day_sent_data,
            "month_labels": month_labels,
            "month_received_data": month_received_data,
            "month_sent_data": month_sent_data,
            "year_labels": year_labels,
            "year_received_data": year_received_data,
            "year_sent_data": year_sent_data,
            "top_labels": top_labels,
            "top_received_data": top_received_data,
            "top_sent_data": top_sent_data,
        },
    )
