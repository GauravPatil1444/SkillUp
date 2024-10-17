import requests
import json
import json5
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("KEY")
CX = os.getenv("CX")
URL1 = os.getenv("URL1")
URL2 = os.getenv("URL2")
URL3 = os.getenv("URL3")

def customsearch(query):
    metadata = []
    start = 1
    for i in range(5):
        params = {
            'q' : query,
            'key' : KEY,
            'cx' : CX,
            'num' : 10
        }
        if i > 0:
            start = start+10
            params['start'] = start

        response = requests.get(URL1,params=params)
        results = response.json()
        for i in range(len(results['items'])):
            metadata.append(
                {
                    'videoID':results['items'][i]['link'],
                    'title':results['items'][i]['title']
                }
            )
    # print('done',len(metadata))
    # with open('data.json', 'w') as f:
    #     json.dump(metadata, f)

    # df = pd.json_normalize(json.load(open('data.json')))
    # data = pd.DataFrame(df[['videoID','title','channelID']])
    # newdf = pd.json_normalize(json.load(metadata))
    # newdata = pd.DataFrame(newdf[['videoID','title','channelID']])
    # data[:51] = newdata
    # with open('data.json', 'w') as f:
    #     json.dump(newdata, f)

    return metadata

def fetchvideos(query):
    metadata = []   
    params = {
        'q' : query,
        'key' : KEY,
        'part' : 'snippet',
        'type' : 'video',
        'maxResults' : '50'
    }
    
    response = requests.get(URL2, params=params)
    results = response.json()
    for i in range(len(results['items'])):
        metadata.append(
            {'videoID':results['items'][i]['id']['videoId'],
            'channelID':results['items'][i]['snippet']['channelId'],
            'title':results['items'][i]['snippet']['title'],
            'channelTitle':results['items'][i]['snippet']['channelTitle']
            }
        )
    # print('done')

    with open('data.json', 'w') as f:
        json.dump(metadata, f)

def fetchcourses(query):
    metadata = []  
    params = {
        'key' : KEY,
        'part' : 'snippet',
        'type' : 'playlist',
        'maxResults' : '50',    
        'regionCode' : 'IN',
        'q' : query
    }
    
    response = requests.get(URL2, params=params)
    results = response.json()
    metadata.append({'nextPageToken':results['nextPageToken']})
    for i in range(len(results['items'])):
        metadata.append(
            {
                'channelTitle':results['items'][i]['snippet']['channelTitle'],
                'title':results['items'][i]['snippet']['title'],
                'playlistId':results['items'][i]['id']['playlistId'],
                'description':results['items'][i]['snippet']['description'],
                'thumbnails':results['items'][i]['snippet']['thumbnails']['medium']['url']        
            }
        )
    
    return metadata

def fetchcoursevideos(query):
    metadata = []  
    params = {
        'key' : KEY,
        'part' : 'snippet,id',
        # 'id': query,
        'maxResults' : '50',    
        'regionCode' : 'IN',
        'playlistId' : query,
    }
    response = requests.get(URL3, params=params)
    results = response.json()
    print(results)
    # metadata.append({'nextPageToken':results['nextPageToken']})
    for i in range(len(results['items'])):
        metadata.append(
            {
                'videoID':results['items'][i]['snippet']['resourceId']['videoId'],
                'title':results['items'][i]['snippet']['title'],      
            }
        )
    
    return metadata

