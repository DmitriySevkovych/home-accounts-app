#!/bin/bash
 
# Create DB container (also creates a database)
docker-compose -f ./src/db/docker-compose.db.yml up -d

# Create DB schemas
dataSource=./src/db/v1/access/data-source.ts
query=''
for schema in utils transactions home work investments; do
    query="${query}CREATE SCHEMA IF NOT EXISTS ${schema};"
done
npm run typeorm query "$query" -- -d $dataSource