import sqlite3
from app.config import DATABASE_URL
from app.schemas import Interface


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
    conn = sqlite3.connect(db_path)
    query = """
        SELECT id, name, alias, active, DATE(created), DATE(updated), rxcounter, txcounter, rxtotal, txtotal
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


# print(fetch_interfaces())
