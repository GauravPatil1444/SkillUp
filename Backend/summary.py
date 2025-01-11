import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("KEY")

def summary(transcript):
    genai.configure(api_key=KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"This is a video transcript {transcript}, generate a summary with explanation of important details or concepts covered in the transcript, don't mention in response that you are refering a transcript"
    response = model.generate_content(prompt)
    response = response.text
    
    return response