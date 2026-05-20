# ─── Stage 1: Build frontend ─────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: Runtime (build backend here for native compat) ──
FROM node:20-alpine
RUN apk add --no-cache tini

# Create cloudlens user
RUN addgroup -S cloudlens && adduser -S cloudlens -G cloudlens

WORKDIR /opt/cloudlens

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

# Copy backend source and build in this stage
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install
COPY backend/ ./backend/
RUN cd backend && npm run build && rm -rf src node_modules/.cache

# Create data directory
RUN mkdir -p /opt/cloudlens/backend/data && \
    chown -R cloudlens:cloudlens /opt/cloudlens

USER cloudlens

ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_DIR=/opt/cloudlens/dist
ENV DB_PATH=/opt/cloudlens/backend/data/cloudlens.db
ENV JWT_SECRET="change-me-in-production"

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "backend/dist/index.js"]
