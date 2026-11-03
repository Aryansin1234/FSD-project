#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  SkillForge — Development Start Script
#
#  Usage:  ./start.sh
#
#  What it does:
#    1. Checks prerequisites (docker, node, npm)
#    2. Copies .env.example -> .env if .env is missing
#    3. Starts PostgreSQL + Redis via docker compose
#    4. Waits for both services to be healthy
#    5. Runs Prisma migrations (creates/updates tables)
#    6. Generates Prisma client
#    7. Seeds the database with demo data (idempotent)
#    8. Starts Next.js dev server in the foreground
#    9. On Ctrl+C / SIGTERM — stops Docker containers cleanly
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PRISMA="./node_modules/.bin/prisma"

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log()    { echo -e "${BLUE}[skillforge]${RESET} $*"; }
ok()     { echo -e "${GREEN}[skillforge]${RESET} $*"; }
warn()   { echo -e "${YELLOW}[skillforge]${RESET} $*"; }
error()  { echo -e "${RED}[skillforge] ERROR:${RESET} $*" >&2; }
header() { echo -e "\n${BOLD}${CYAN}$*${RESET}\n"; }

# ── Cleanup on exit ───────────────────────────────────────────────────────────
cleanup() {
  echo ""
  header "Stopping SkillForge..."

  if [[ -n "${NEXTJS_PID:-}" ]] && kill -0 "$NEXTJS_PID" 2>/dev/null; then
    log "Stopping Next.js dev server (pid $NEXTJS_PID)..."
    kill "$NEXTJS_PID" 2>/dev/null || true
    wait "$NEXTJS_PID" 2>/dev/null || true
    ok "Next.js stopped."
  fi

  log "Stopping Docker containers (PostgreSQL + Redis)..."
  docker compose down --timeout 10 2>/dev/null || true
  ok "Docker containers stopped."

  echo ""
  ok "SkillForge shut down cleanly."
}

trap cleanup EXIT INT TERM

# ── Step 0: Prerequisites ─────────────────────────────────────────────────────
header "SkillForge — Development Environment"
log "Checking prerequisites..."

MISSING=()
command -v docker &>/dev/null || MISSING+=("docker")
command -v node   &>/dev/null || MISSING+=("node")
command -v npm    &>/dev/null || MISSING+=("npm")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  error "Missing required tools: ${MISSING[*]}"
  error "Install them and retry."
  exit 1
fi

if ! docker info &>/dev/null; then
  error "Docker daemon is not running. Start Docker Desktop and retry."
  exit 1
fi

ok "Prerequisites satisfied  (docker, node $(node -v), npm $(npm -v))"

# ── Step 1: Environment file ──────────────────────────────────────────────────
if [[ ! -f ".env" ]]; then
  warn ".env not found — copying from .env.example"
  cp .env.example .env
  ok ".env created."
fi

# Export all vars from .env so prisma CLI and seed script can read them
set -a
# shellcheck disable=SC1091
source .env
set +a

# Auto-detect DATABASE_URL: if the current value still has the placeholder
# Docker credentials and the Docker container is not yet running (or the
# local OS-user PostgreSQL is available), switch to the OS-user URL.
OS_USER="$(whoami)"
DOCKER_DB_URL="postgresql://skillforge:skillforge_secret@127.0.0.1:5432/skillforge"
LOCAL_DB_URL="postgresql://${OS_USER}@127.0.0.1:5432/skillforge"

# If DATABASE_URL is the Docker default, check whether we should use local user instead
if [[ "${DATABASE_URL:-}" == "$DOCKER_DB_URL" ]]; then
  # Test if local peer-auth connection works (macOS with Postgres.app or Homebrew)
  if psql -U "$OS_USER" -d postgres -c "SELECT 1" &>/dev/null 2>&1; then
    log "Local PostgreSQL detected for user '$OS_USER' — using peer auth URL."
    DATABASE_URL="$LOCAL_DB_URL"
    export DATABASE_URL
  fi
fi

# ── Step 2: Install dependencies ──────────────────────────────────────────────
if [[ ! -d "node_modules" ]] || [[ ! -f "$PRISMA" ]]; then
  log "Installing npm dependencies..."
  npm install --silent
  ok "Dependencies installed."
fi

# ── Step 3: Start Docker services ─────────────────────────────────────────────
log "Starting Docker services (PostgreSQL + Redis)..."
docker compose up -d --remove-orphans
echo ""

# ── Step 4: Wait for PostgreSQL ───────────────────────────────────────────────
log "Waiting for PostgreSQL to be ready..."
TIMEOUT=60
ELAPSED=0
until docker compose exec -T postgres \
      pg_isready -U "${POSTGRES_USER:-skillforge}" -d "${POSTGRES_DB:-skillforge}" &>/dev/null; do
  if [[ $ELAPSED -ge $TIMEOUT ]]; then
    error "PostgreSQL did not become ready within ${TIMEOUT}s."
    docker compose logs postgres | tail -20
    exit 1
  fi
  printf "."
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done
echo ""
ok "PostgreSQL is ready."

# ── Step 5: Wait for Redis ────────────────────────────────────────────────────
log "Waiting for Redis to be ready..."
ELAPSED=0
until docker compose exec -T redis \
      redis-cli -a "${REDIS_PASSWORD:-redis_secret}" ping 2>/dev/null | grep -q "PONG"; do
  if [[ $ELAPSED -ge $TIMEOUT ]]; then
    error "Redis did not become ready within ${TIMEOUT}s."
    docker compose logs redis | tail -20
    exit 1
  fi
  printf "."
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done
echo ""
ok "Redis is ready."

# ── Step 6: Run Prisma migrations ─────────────────────────────────────────────
log "Applying database migrations..."

MIGRATE_STATUS=0
"$PRISMA" migrate deploy 2>&1 || MIGRATE_STATUS=$?

if [[ $MIGRATE_STATUS -ne 0 ]]; then
  # No migration history yet — create and apply the initial migration
  log "No migration history found — creating initial migration..."
  "$PRISMA" migrate dev --name init 2>&1 || {
    error "Migration failed. Check DATABASE_URL in .env and retry."
    exit 1
  }
fi

ok "Migrations applied."

# ── Step 7: Generate Prisma client ────────────────────────────────────────────
log "Generating Prisma client..."
"$PRISMA" generate --no-hints 2>&1 | grep -E "Generated|error" || true
ok "Prisma client ready."

# ── Step 8: Seed database ─────────────────────────────────────────────────────
log "Seeding database with demo data..."
npm run db:seed 2>&1 || warn "Seed reported an issue (data may already exist). Continuing."

# ── Step 9: Launch Next.js ────────────────────────────────────────────────────
header "SkillForge is starting"
echo -e "  ${GREEN}App${RESET}          http://localhost:3000"
echo -e "  ${GREEN}Login${RESET}        http://localhost:3000/login"
echo -e "  ${GREEN}DB Studio${RESET}    run: npx prisma studio  (separate terminal)"
echo ""
echo -e "  Demo accounts ${YELLOW}(password: demo1234)${RESET}"
echo -e "    sarah.chen@skillforge.io      Employee"
echo -e "    alex.rivera@skillforge.io     Manager"
echo -e "    admin@skillforge.io           Admin"
echo ""
echo -e "  ${YELLOW}Press Ctrl+C to stop all services${RESET}"
echo ""

npm run dev &
NEXTJS_PID=$!

# Keep alive until Next.js exits or signal received
wait "$NEXTJS_PID"
