import requests, json
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"}
url = "https://www.reddit.com/r/Entrepreneur/search.json?q=looking+for+recommendations+recommendation+best+&restrict_sr=1&limit=10"
r = requests.get(url, headers=UA, timeout=20)
print(r.status_code, len(r.text))
print(r.text[:300])
