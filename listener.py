#!/usr/bin/env python3
"""Social-listening + response-drafting pipeline (demo).

Scans target subreddits for buying-intent posts and drafts
human-in-the-loop responses. Live mode hits the public Reddit JSON
API; if that is blocked, falls back to bundled real seed data so the
demo always produces a working sample.
"""
import json, os, re, time, urllib.request, urllib.parse

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"}

POSITIVE = re.compile(
    r"recommend|recommendation|best |suggestion|which .*should.*use|"
    r"which .*should.*get|looking for|need (a|some)|"
    r"what .*(tool|software|app|crm|platform)|"
    r"any .*(good|best|reliable)|help me (find|choose|pick)", re.I)
NEGATIVE = re.compile(r"hate|worst|scam|don.t use|avoid|broken|terrible|waste", re.I)

SUBREDDITS = ["CRM", "smallbusiness", "SaaS"]


def http_json(url, retries=1):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read().decode("utf-8", "ignore"))
    except Exception:
        return None


def search_reddit(sub, query, limit=25):
    url = (f"https://www.reddit.com/r/{sub}/search.json?"
           f"q={urllib.parse.quote(query)}&restrict_sr=1&limit={limit}")
    return http_json(url)


def score_post(title, body=""):
    text = f"{title} {body}".lower()
    return len(POSITIVE.findall(text)) - len(NEGATIVE.findall(text))


def collect_live(keywords, limit=20):
    seen, leads = set(), []
    for sub in SUBREDDITS:
        for kw in keywords:
            data = search_reddit(sub, kw)
            if not data or "data" not in data:
                continue
            for c in data["data"]["children"]:
                d = c["data"]
                pid = d.get("id")
                if pid in seen:
                    continue
                seen.add(pid)
                s = score_post(d.get("title", ""), d.get("selftext", ""))
                if s > 0:
                    leads.append(_mklead(pid, f"r/{sub}", d.get("title", ""),
                                         d.get("permalink", ""), d.get("author"),
                                         s, d.get("num_comments", 0), kw))
    leads.sort(key=lambda x: -x["score"])
    return leads[:limit]


def _mklead(pid, sub, title, permalink, author, score, comments, kw):
    return {"id": pid, "subreddit": sub, "title": title[:160],
            "url": "https://www.reddit.com" + permalink,
            "author": author, "score": score, "comments": comments, "keyword": kw}


def load_seed():
    if os.path.exists("seed_leads.json"):
        return json.load(open("seed_leads.json"))
    return []


def collect(keywords, limit=20):
    """Live first; falls back to bundled real seed data if blocked/slow."""
    live = collect_live(keywords, limit)
    if live:
        print(f"[live] {len(live)} leads from reddit.com")
        return live
    seed = load_seed()
    print(f"[seed] reddit blocked; using {len(seed)} bundled real leads")
    return seed


def draft_response(lead):
    return (f"Hi {lead['author']}, saw your post in {lead['subreddit']} about "
            f"'{lead['title'][:70]}...' - we built a tool that does exactly this "
            f"(social listening + automated outreach with human approval). "
            f"Happy to share a 5-min demo. Would a quick call work this week?")


if __name__ == "__main__":
    if os.path.exists("keywords.json"):
        keywords = json.load(open("keywords.json"))
    else:
        keywords = ["looking for a recommendation", "best tool for",
                    "which crm should i use", "recommend a software",
                    "need a tool for", "what software should i use"]
    leads = collect(keywords)
    print(f"\n=== {len(leads)} buying-intent leads ===\n")
    for i, l in enumerate(leads, 1):
        print(f"{i}. [{l['score']}] {l['subreddit']} - {l['title']}")
        print(f"   {l['url']}")
        print(f"   draft: {draft_response(l)}\n")
    with open("leads_sample.json", "w") as f:
        json.dump(leads, f, indent=2)
    print("saved -> leads_sample.json")