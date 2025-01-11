from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)
def chat_model(question):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""following is a doubt came in my mind while watching a youtube video, give the most accurate answer to the question,
                "Question" : {question}
                """,
            }
        ],
        model="llama-3.1-8b-instant",
    )
    return chat_completion.choices[0].message.content