import urllib.request
import urllib.error

req = urllib.request.Request('http://localhost:8000/api/advisor/summary', method='GET')
try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
