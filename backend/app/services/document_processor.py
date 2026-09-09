import re
from typing import List, Dict, Any

class DocumentProcessorService:
    def chunk_text(self, text: str, max_words: int = 100) -> List[str]:
        """
        Splits paper abstracts/full text into coherent sentence-bounded chunks.
        """
        if not text:
            return []
        
        # Split into sentences
        sentences = re.split(r'(?<=[.!?])\s+', text.strip())
        chunks: List[str] = []
        current_chunk: List[str] = []
        current_word_count = 0

        for sent in sentences:
            words = sent.split()
            word_count = len(words)
            if current_word_count + word_count > max_words and current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [sent]
                current_word_count = word_count
            else:
                current_chunk.append(sent)
                current_word_count += word_count

        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks

    def build_provenance(self, source: str, title: str, doi: str = None, url: str = None, chunk_index: int = 0) -> str:
        """
        Generates strict, traceable citation provenance for every extracted claim.
        """
        doi_str = f" | DOI: {doi}" if doi else ""
        url_str = f" | URL: {url}" if url and not doi else ""
        return f"Provenance: [{source}] Paper: '{title}'{doi_str}{url_str} (Chunk #{chunk_index + 1})"

document_processor = DocumentProcessorService()
