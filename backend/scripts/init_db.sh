#!/usr/bin/env bash
# Creates the application database and its dedicated MySQL user.
#
#   ./scripts/init_db.sh            # authenticates as root
#   ./scripts/init_db.sh admin      # authenticates as some other superuser
#
# The app credentials are read from backend/.env; the superuser password is
# typed at the prompt and never stored.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "backend/.env not found — copy .env.example first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a

: "${MYSQL_DATABASE:?MYSQL_DATABASE missing from .env}"
: "${MYSQL_USER:?MYSQL_USER missing from .env}"
: "${MYSQL_PASSWORD:?MYSQL_PASSWORD missing from .env}"

ADMIN_USER="${1:-root}"
ADMIN_HOST="${MYSQL_HOST:-127.0.0.1}"
ADMIN_PORT="${MYSQL_PORT:-3306}"

echo "Creating database '${MYSQL_DATABASE}' and user '${MYSQL_USER}' as '${ADMIN_USER}'..."

mysql -u "$ADMIN_USER" -h "$ADMIN_HOST" -P "$ADMIN_PORT" -p <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'127.0.0.1' IDENTIFIED BY '${MYSQL_PASSWORD}';
ALTER USER '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';
ALTER USER '${MYSQL_USER}'@'127.0.0.1' IDENTIFIED BY '${MYSQL_PASSWORD}';

GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

echo "Done. The API will create the user_auth table on startup."
