#!/bin/bash
 
# DB container
docker-compose -f ./src/db/docker-compose.db.yml up -d

# DB migrations