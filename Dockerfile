# Multi-stage build for PINKSYNC platform
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 py3-pip
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PYTHONPATH=/app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install Python runtime
RUN apk add --no-cache python3 py3-pip

# Copy Python dependencies
COPY --from=deps /usr/lib/python3.11/site-packages /usr/lib/python3.11/site-packages

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Python API
COPY --from=builder /app/api ./api
COPY --from=builder /app/requirements.txt ./

USER nextjs

EXPOSE 3000
EXPOSE 8000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start both Next.js and FastAPI
CMD ["sh", "-c", "python3 -m uvicorn api.main:app --host 0.0.0.0 --port 8000 & node server.js"]
