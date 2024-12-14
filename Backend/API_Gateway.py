from fastapi import FastAPI,Request
from recommender import recommender
from content_provider import fetchcourses,customsearch, fetchcoursevideos
from transcript import transcript
import json
from pydantic import BaseModel
from threading import Lock
import os
import time
from datetime import datetime, timedelta

app = FastAPI()

COOL_DOWN_TIME = 60
LAST_CALL_TIME = 0
COOL_DOWN_LOCK = Lock()

request_data_file = 'request_data.json'

REQUEST_LIMIT = 30

TIME_PERIOD = timedelta(days=1)

if not os.path.exists(request_data_file):
    with open(request_data_file, 'w') as file:
        json.dump({"request_count": 0, "last_request_time": str(datetime.now())}, file)

def read_request_data():
    with open(request_data_file, 'r') as file:
        data = json.load(file)
    return data

def write_request_data(data):
    with open(request_data_file, 'w') as file:
        json.dump(data, file)


class Item(BaseModel):
    q: str|None = None
    data:str|None = None


@app.get("/")
async def root():
    return "Welcome to skillup.AI! this is API_Gateway and services are running successfully."



@app.post("/recommender")
async def sendrecommendation(request: Request):
    data = await request.json()
    ID = data["videoID"]
    metadata = data["data"]
    return recommender(ID, metadata)


@app.post("/transcript")
async def sendtranscript(item:Item):
    global LAST_CALL_TIME
    with COOL_DOWN_LOCK:
        current_time = time.time()
        time_since_last_call = current_time - LAST_CALL_TIME
        # print(current_time,LAST_CALL_TIME,time_since_last_call)
        if time_since_last_call<COOL_DOWN_TIME:
            return {'error':'Server is cooling down, retry after 1 minute'}
    
    LAST_CALL_TIME = current_time
    data = item.model_dump()
    transcr = data['data']
    return transcript(transcr)
    
    
@app.post("/customsearch")
async def search(item:Item):
    request_data = read_request_data()
    
    current_time = datetime.now()
    last_request_time = datetime.fromisoformat(request_data["last_request_time"])
    time_since_last_request = current_time - last_request_time

    if time_since_last_request > TIME_PERIOD:
        request_data["request_count"] = 0
        request_data["last_request_time"] = str(current_time)

    if request_data["request_count"] >= REQUEST_LIMIT:
        return {'error':'Request limit exceeded, retry tomorrow'}
    
    request_data["request_count"] += 1
    request_data["last_request_time"] = str(current_time)

    write_request_data(request_data)

    data = item.model_dump()
    q = data["q"]
    return customsearch(q)

@app.post("/fetchcourses")
def sendcourses(item:Item):
    data = item.model_dump()
    q = data["q"]
    return fetchcourses(q)

@app.post("/fetchcoursevideos")
def sendcoursevideos(item:Item):
    data = item.model_dump()
    q = data["q"]
    print(q)
    return fetchcoursevideos(q)