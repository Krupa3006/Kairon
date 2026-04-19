import io
import structlog

log = structlog.get_logger()


async def parse_cv(content: bytes, filename: str) -> str:
    """Parse CV from PDF or DOCX bytes. Returns plain text."""
    if filename.lower().endswith(".pdf"):
        return _parse_pdf(content)
    elif filename.lower().endswith(".docx"):
        return _parse_docx(content)
    else:
        raise ValueError(f"Unsupported file type: {filename}")


def _parse_pdf(content: bytes) -> str:
    import PyPDF2
    reader = PyPDF2.PdfReader(io.BytesIO(content))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    full = "\n\n".join(pages)
    log.info("PDF parsed", pages=len(pages), chars=len(full))
    return full


def _parse_docx(content: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(content))
    paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    full = "\n".join(paras)
    log.info("DOCX parsed", paragraphs=len(paras), chars=len(full))
    return full
