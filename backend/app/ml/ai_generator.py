from openai import OpenAI
from dotenv import load_dotenv
import os
from prompts import system_prompt, user_prompt

def generateCoverLetter():
    load_dotenv()
    api_key = os.getenv('DEEPSEEK_API_KEY')
    base_url = 'https://api.deepseek.com'

    client = OpenAI(api_key=api_key, base_url=base_url)

    try:
        print("Starting cover letter generation...")
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            stream=False
        )

        print("Cover letter generation complete!")
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating cover letter: {e}")
        return "Sorry, I couldn't generate a cover letter at this time. Please try again later."

print(generateCoverLetter())