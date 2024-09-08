from fastapi import FastAPI
import uvicorn
from recommender import recommender
from content_provider import fetchcourses,customsearch
from transcript import transcript
import json

app = FastAPI()

@app.get("/")
async def root():
    return "Welcome to skillup.AI! this is API_Gateway and services are running successfully."


@app.post("/recommender")
async def sendrecommendation():
    id = 'BGTx91t8q50'
    return json.dumps(recommender(id))


@app.get("/transcript")
async def sendtranscript():
    videoID = 'xk4_1vDrzzo'
    return transcript(videoID)
    
    
@app.get("/customsearch")
async def search():
    q = 'java tutorials'
    return customsearch(q)


@app.get("/fetchcourses")
def sendcourses():
    q = "java"
    return fetchcourses(q)
