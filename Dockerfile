# ─────────────────────────────────────────────
# Stage 1: Builder — install deps in isolation
# ─────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --default-timeout=1000 --prefix=/install -r requirements.txt

# ─────────────────────────────────────────────
# Stage 2: Runtime — lean production image
# ─────────────────────────────────────────────
FROM python:3.11-slim AS runtime

LABEL maintainer="tuta699" \
      org.opencontainers.image.title="Credit Card Fraud Detection API" \
      org.opencontainers.image.description="Advanced ML fraud detection with Ensemble models, SHAP explainability, and real-time monitoring" \
      org.opencontainers.image.version="3.0.0" \
      org.opencontainers.image.source="https://github.com/tuta699/credit-card-fraud-detection"

WORKDIR /app

# Runtime system deps only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Create non-root user for security
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

# Set Python path so src package is importable
ENV PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_ENV=production \
    LOG_LEVEL=INFO \
    API_HOST=0.0.0.0 \
    API_PORT=8000

# Copy only what the API needs at runtime
COPY --chown=appuser:appgroup src/ ./src/
COPY --chown=appuser:appgroup config/ ./config/
COPY --chown=appuser:appgroup models/ ./models/

# Create writable dirs, then lock down ownership
RUN mkdir -p logs outputs/plots outputs/results && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Liveness probe
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
