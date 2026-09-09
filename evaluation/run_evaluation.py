import json
import asyncio
import httpx

async def main():
    print("=" * 60)
    print("KnowSure Evaluation Benchmark Runner")
    print("=" * 60)
    with open("evaluation/benchmarks/sample_questions.json", "r") as f:
        data = json.load(f)
    print(f"Loaded {len(data)} evaluation benchmark samples.")
    print("Testing local backend API endpoint...")

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.get("http://localhost:8000/api/v1/health")
            print("Backend status:", res.json())
        except Exception as e:
            print("Backend health check failed:", e)

if __name__ == "__main__":
    asyncio.run(main())
