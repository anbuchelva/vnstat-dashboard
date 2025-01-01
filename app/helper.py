import sqlite3
from app.config import DATABASE_URL
from app.schemas import Interface

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
            txtotal=row[9]
        ).dict()
        for row in result
    ]

    return interfaces
