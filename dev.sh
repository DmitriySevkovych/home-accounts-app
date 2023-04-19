#!/bin/bash
 
# Set necessary environment variables
set -o allexport
source .env.local
source .env
set +o allexport

if [[ -z "${NEXT_PORT}" ]]; then export NEXT_PORT=8080; fi

# Setup database
docker-compose -f ./db/docker-compose.db.yml up -d

# Run the Next.js dev task and preppy-print the output using pino
npx next dev -p ${NEXT_PORT} | pino-pretty --colorize --translateTime

