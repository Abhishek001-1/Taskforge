"""One-shot script: upload Abhishek_Wani.pdf and print the AI analysis result."""
import asyncio
import json
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))

import httpx

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNTQ0YTI0ZS0wMWZjLTQ2Y2EtYTNmYi03ZmVlMGNiMDJlOTgiLCJlbWFpbCI6IkFiaGlzaGVrd2FuaTAxQGdtYWlsLmNvbSIsImV4cCI6MTc4NTI2OTQ5MX0.aBa4OimuvRZprqHf2DtTEhSo423To-IodF1MWH0Xxo4"
PDF_PATH = r"E:\TaskForge\Abhishek_Wani.pdf"
API = "http://localhost:8001"

async def main():
    with open(PDF_PATH, "rb") as f:
        pdf_bytes = f.read()

    print(f"Uploading {len(pdf_bytes)} bytes PDF...")
    async with httpx.AsyncClient(timeout=180) as client:
        resp = await client.post(
            f"{API}/ai/resume/upload",
            headers={"Authorization": f"Bearer {TOKEN}"},
            files={"file": ("Abhishek_Wani.pdf", pdf_bytes, "application/pdf")},
        )
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"Resume ID: {data['id']}")
        print(f"Filename: {data['filename']}")
        a = data.get("analysis") or {}
        print(f"\n--- ANALYSIS KEYS ---")
        for k, v in a.items():
            if isinstance(v, list):
                print(f"  {k}: {v[:3]}{'...' if len(v) > 3 else ''}")
            else:
                print(f"  {k}: {str(v)[:100]}")
        print("\nDone!")
    else:
        print(f"ERROR: {resp.text}")

asyncio.run(main())
