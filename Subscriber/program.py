import requests
from requests.api import request

SUBSCRIBE_URL = "http://localhost:8080/subscribe/john?format=xml"

try:
    response = requests.get(SUBSCRIBE_URL)
except requests.exceptions.RequestException as e:
    raise SystemExit(e)

if response.status_code == 200:
    data = "Here's your new messages:\n\n" + response.text
elif response.status_code == 204:
    data = "No new messages was available!"


print(data)
