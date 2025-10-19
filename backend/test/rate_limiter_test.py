import requests
import time

url = "http://127.0.0.1:8000/signup"
data = {
    "firstname": "Rate",
    "lastname": "Limit",
    "email": "ratelimit@test.com",
    "password": "123456",
    "confirmPassword": "123456"
}

for i in range(3):
    res = requests.post(url, json=data)
    print(i, res.status_code, res.json())
    time.sleep(0.2)  # less than 1 sec
