# About handling the DB

## Repository pattern

TODO docs!

## TypeORM

TODO docs!

-   https://typeorm.io/
-   https://orkhan.gitbook.io/typeorm/docs
-   https://www.darraghoriordan.com/2022/06/13/persistence-7-typeorm-postgres-9-tips-tricks-issues/

### How to generate entities

Use https://github.com/Kononnable/typeorm-model-generator to generate entities from an existing Postgres database, then adjust manually as necessary:
```
npx typeorm-model-generator
```

### How to generate migrations from entities

To generate migrations from entities, run the following commands
```
cd apps/backend/
npm run typeorm migration:generate -- ./src/db/v1/migrations/testMigration -d ./src/db/v1/access/data-source.ts -p -w backend
```


## Autostarting DB container for dev, test

TODO docs!

-   https://github.com/testjavascript/nodejs-integration-tests-best-practices
-   https://github.com/w3tecch/typeorm-seeding

### Troubleshooting

- Database not appearing in DBeaver (after connecting to container) &rarr; https://stackoverflow.com/questions/63783786/docker-postgres-container-not-creating-expected-database
