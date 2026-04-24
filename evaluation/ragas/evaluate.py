import os
import json
import requests
import csv
from dotenv import load_dotenv

load_dotenv(os.path.join(
    os.path.dirname(__file__), '..', '..',
    'services', 'rag-service', '.env'
))

RAG_SERVICE_URL = "http://localhost:8000"

TEST_CASES = [
    {
        "question": "What are the phases of cloud migration?",
        "key_terms": ["assessment", "planning", "migration", "optimization"],
    },
    {
        "question": "How does RAG reduce hallucinations?",
        "key_terms": ["grounding", "context", "retrieved", "knowledge"],
    },
    {
        "question": "What is a headless CMS?",
        "key_terms": ["decouple", "content", "api", "presentation"],
    },
    {
        "question": "What is domain ownership in data mesh?",
        "key_terms": ["domain", "owns", "responsible", "data"],
    },
    {
        "question": "What are the key microservices patterns?",
        "key_terms": ["api gateway", "circuit breaker", "event sourcing", "cqrs"],
    },
]

def call_rag(question):
    res = requests.post(
        f"{RAG_SERVICE_URL}/query",
        json={"question": question, "top_k": 5, "provider": "gemini"},
        timeout=60,
    )
    res.raise_for_status()
    data = res.json()
    return data["answer"], data.get("sources", []), data.get("chunks_retrieved", 0)

def score_faithfulness(answer, sources):
    return 1.0 if sources else 0.0

def score_relevancy(answer, question):
    q_terms = set(question.lower().split())
    a_terms = set(answer.lower().split())
    overlap = q_terms & a_terms
    return min(len(overlap) / max(len(q_terms), 1), 1.0)

def score_context_recall(answer, key_terms):
    answer_lower = answer.lower()
    found = sum(1 for t in key_terms if t in answer_lower)
    return found / len(key_terms)

def score_context_precision(chunks_retrieved, sources):
    if chunks_retrieved == 0:
        return 0.0
    return min(len(sources) / chunks_retrieved, 1.0)

def run_evaluation():
    print("Running Kortex RAG Evaluation")
    print("=" * 50)

    results = []
    for i, tc in enumerate(TEST_CASES):
        print(f"\nQ{i+1}: {tc['question']}")
        try:
            answer, sources, chunks = call_rag(tc["question"])
            f  = score_faithfulness(answer, sources)
            ar = score_relevancy(answer, tc["question"])
            cr = score_context_recall(answer, tc["key_terms"])
            cp = score_context_precision(chunks, sources)

            results.append({
                "question": tc["question"],
                "faithfulness": f,
                "answer_relevancy": ar,
                "context_recall": cr,
                "context_precision": cp,
            })

            print(f"  Answer: {answer[:100]}...")
            print(f"  Sources: {len(sources)} | Chunks: {chunks}")
            print(f"  F:{f:.2f} AR:{ar:.2f} CR:{cr:.2f} CP:{cp:.2f}")
        except Exception as e:
            print(f"  Error: {e}")

    print("\n" + "=" * 50)
    print("FINAL RESULTS")
    print("=" * 50)

    if results:
        avg_f  = sum(r["faithfulness"] for r in results) / len(results)
        avg_ar = sum(r["answer_relevancy"] for r in results) / len(results)
        avg_cr = sum(r["context_recall"] for r in results) / len(results)
        avg_cp = sum(r["context_precision"] for r in results) / len(results)
        overall = (avg_f + avg_ar + avg_cr + avg_cp) / 4

        print(f"\nFaithfulness:      {avg_f:.3f}")
        print(f"Answer Relevancy:  {avg_ar:.3f}")
        print(f"Context Recall:    {avg_cr:.3f}")
        print(f"Context Precision: {avg_cp:.3f}")
        print(f"\nOverall Score:     {overall:.3f}")
        print("=" * 50)

        output = os.path.join(os.path.dirname(__file__), 'results.csv')
        with open(output, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)
        print(f"\nResults saved to: {output}")

if __name__ == "__main__":
    run_evaluation()
