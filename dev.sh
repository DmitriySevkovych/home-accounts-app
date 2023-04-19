#!/bin/bash
 
# Set necessary environment variables
set -o allexport
source .env.local
set +o allexport

docker-compose -f ./db/docker-compose.db.yml up -d

# Run the Next.js dev task and preppy-print the output using pino
npx next dev -p 8080 | pino-pretty --colorize --translateTime