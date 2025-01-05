import sqlite3
from app.schemas import Interface, InterfaceStatistics
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")


# Convert bytes to a human-readable format
def format_bytes(bytes: int) -> str:
    if bytes == 0:
        return "0 B"  # Return "0 B" if the value is 0
    elif bytes < 1024:
        return f"{bytes} B"
    elif bytes < 1024**2:
        return f"{bytes / 1024:.2f} KB"
    elif bytes < 1024**3:
        return f"{bytes / 1024**2:.2f} MB"
    elif bytes < 1024**4:
        return f"{bytes / 1024**3:.2f} GB"
    else:
        return f"{bytes / 1024**4:.2f} TB"


# Fetch Interfaces from db.
def fetch_interfaces(db_path=DATABASE_URL):
    conn = sqlite3.connect(db_path, timeout=10)
    query = """
        SELECT 
            id, 
            name, 
            alias, 
            active, 
            DATE(created), 
            DATE(updated), 
            rxcounter, 
            txcounter, 
            rxtotal, 
            txtotal
        FROM interface
    """
    result = conn.execute(query).fetchall()
    conn.close()

    # Convert result to a list of dictionaries, using the Pydantic `dict()` method for each Interface
    interfaces = [
        Interface(
            id=row[0],
            name=row[1],
            alias=row[2],
            active=row[3],
            created=row[4],
            updated=row[5],
            rxcounter=row[6],
            txcounter=row[7],
            rxtotal=row[8],
            txtotal=row[9],
            alltime=row[8] + row[9],
        ).dict()
        for row in result
    ]

    return interfaces


# Fetch Interface Statistics from db.
def fetch_statistics(interface_id, db_path=DATABASE_URL):
    data = {}
    conn = sqlite3.connect(db_path, timeout=10)
    tables = ["fiveminute", "hour", "day", "month", "year", "top"]

    for table in tables:
        query = f"""
            SELECT 
                id,
                interface,
                datetime(date),
                rx, 
                tx
            FROM {table}
            WHERE interface = ?
            ORDER BY date DESC;
        """
        result = conn.execute(query, (interface_id,)).fetchall()

        # Convert result to InterfaceStatistics models
        interface_statistics = [
            InterfaceStatistics(id=row[0], interface=row[1], date=row[2], rx=row[3], tx=row[4], total=row[3] + row[4]).dict()
            for row in result
        ]

        # Store the statistics in the data dictionary
        data[table] = interface_statistics if result else []

    conn.close()
    return data
