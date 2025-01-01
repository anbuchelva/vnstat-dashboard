from pydantic import BaseModel
from datetime import date
from typing import Optional


class Interface(BaseModel):
    id: int
    name: str
    alias: str | None
    active: int
    created: date
    updated: date
    rxcounter: int
    txcounter: int
    rxtotal: int
    txtotal: int
    alltime: int

    class Config:
        from_attributes = True
