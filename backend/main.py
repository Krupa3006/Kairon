from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import structlog

from config import get_settings
from api.routes import router
from worker.scheduler import setup_scheduler

log = structlog.get_logger()
settings = get_settings()

scheduler: AsyncIOScheduler | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global scheduler
    log.info("Starting JobFlow AI backend")
    scheduler = setup_scheduler()
    scheduler.start()
    log.info("Scheduler started", jobs=len(scheduler.get_jobs()))
    yield
    if scheduler:
        scheduler.shutdown(wait=False)
    log.info("Backend shutdown")


app = FastAPI(
    title="JobFlow AI Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://kairon.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "jobflow-ai"}
