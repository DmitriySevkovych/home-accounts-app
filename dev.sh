#!/bin/bash
 
# Set necessary environment variables
set -o allexport
source .env.local
source .env
set +o allexport

if [[ -z "${NEXT_PORT}" ]]; then export NEXT_PORT=8080; fi

# Setup database
node dev.globalSetup.js

if [[ $? -eq 0 ]]; then
    # Run the Next.js dev task and preppy-print the output using pino
    npx next dev -p ${NEXT_PORT} | pino-pretty --colorize --translateTime;
fi

# Teardowm
node dev.globalTeardown.js