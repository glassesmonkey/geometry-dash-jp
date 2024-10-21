import requests
from dotenv import load_dotenv
import os
import json

# 加载 .env 文件中的环境变量
load_dotenv()

# 从环境变量中获取 PICSART_KEY 的值
picsart_key = os.getenv("PICSART_UPLOAD_KEY")

url = "https://api.picsart.io/tools/1.0/upload"

files = { "image": ("women.jpeg", open("test.jpg", "rb"), "image/jpg") }
headers = {
    "accept": "application/json",
    "X-Picsart-API-Key": picsart_key
}

response = requests.post(url, files=files, headers=headers)

print(response.text)