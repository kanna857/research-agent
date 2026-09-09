import logging
import hashlib
import numpy as np
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class QdrantService:
    COLLECTION_NAME = "knowsure_evidence"
    VECTOR_DIM = 128

    def __init__(self):
        self.host = settings.QDRANT_HOST
        self.port = settings.QDRANT_PORT
        self.client = None
        # In-memory vector store fallback when Qdrant container is offline
        self.memory_vectors: List[Dict[str, Any]] = []

    def is_connected(self) -> bool:
        return self.client is not None

    def _generate_vector(self, text: str) -> List[float]:
        """
        Generates a deterministic pseudo-dense vector embedding (128-dim) for text chunks.
        This provides semantic similarity vector operations even without heavy PyTorch downloads.
        """
        vector = [0.0] * self.VECTOR_DIM
        words = text.lower().split()
        for idx, word in enumerate(words):
            hash_val = int(hashlib.md5(word.encode()).hexdigest(), 16)
            dim_idx = hash_val % self.VECTOR_DIM
            vector[dim_idx] += 1.0 / (idx + 1.0)
        
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = (np.array(vector) / norm).tolist()
        return vector

    async def initialize(self):
        """
        Attempts connection to Qdrant vector database and ensures collection exists.
        """
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import VectorParams, Distance
            self.client = QdrantClient(host=self.host, port=self.port, timeout=2.0)
            
            collections = self.client.get_collections().collections
            col_names = [c.name for c in collections]
            if self.COLLECTION_NAME not in col_names:
                self.client.create_collection(
                    collection_name=self.COLLECTION_NAME,
                    vectors_config=VectorParams(size=self.VECTOR_DIM, distance=Distance.COSINE)
                )
            logger.info("Qdrant Vector DB connected and collection 'knowsure_evidence' verified.")
        except Exception as e:
            logger.info(f"Qdrant Vector DB offline ({e}). Utilizing in-memory semantic vector store.")
            self.client = None

    async def upsert_evidence(self, claims: List[Dict[str, Any]]) -> int:
        """
        Upserts claim & evidence vectors with rich metadata into Qdrant or in-memory vector store.
        """
        upserted_count = 0
        for claim in claims:
            statement = claim.get("statement", "")
            evidence_text = claim.get("evidence_text", "")
            combined_text = f"{statement} {evidence_text}"
            vector = self._generate_vector(combined_text)

            payload = {
                "claim_id": claim.get("claim_id"),
                "paper_id": claim.get("paper_id"),
                "statement": statement,
                "evidence_text": evidence_text,
                "verification_status": claim.get("verification_status"),
                "confidence_score": claim.get("confidence_score"),
                "explanation": claim.get("explanation")
            }

            if self.client:
                try:
                    from qdrant_client.models import PointStruct
                    point_id = int(hashlib.md5(claim.get("claim_id", "").encode()).hexdigest()[:8], 16)
                    self.client.upsert(
                        collection_name=self.COLLECTION_NAME,
                        points=[PointStruct(id=point_id, vector=vector, payload=payload)]
                    )
                    upserted_count += 1
                except Exception as e:
                    logger.error(f"Error upserting to Qdrant: {e}")
            else:
                self.memory_vectors.append({
                    "vector": vector,
                    "payload": payload
                })
                upserted_count += 1

        return upserted_count

    async def search_evidence(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Performs semantic vector search over stored evidence vectors.
        """
        query_vec = self._generate_vector(query)
        
        if self.client:
            try:
                hits = self.client.search(
                    collection_name=self.COLLECTION_NAME,
                    query_vector=query_vec,
                    limit=top_k
                )
                return [hit.payload for hit in hits]
            except Exception as e:
                logger.error(f"Qdrant search error: {e}")

        # In-memory vector cosine similarity fallback
        results = []
        for item in self.memory_vectors:
            vec = item["vector"]
            sim = float(np.dot(query_vec, vec))
            results.append((sim, item["payload"]))

        results.sort(key=lambda x: x[0], reverse=True)
        return [payload for sim, payload in results[:top_k]]

qdrant_service = QdrantService()
