#!/bin/bash

# DB container
docker compose -f ./src/db/docker-compose.db.yml down

# Remove postgres volume
#rm -rf apps/backend/src/db/pgdata
