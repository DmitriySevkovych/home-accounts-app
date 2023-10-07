#!/bin/bash

db_root=./src/db
db_data=$db_root/v1
db_init_script=$db_root/init.sql

# Create init.sql script
mv $db_init_script ${db_init_script}.bak

echo $'-- THIS IS A GENERATED SCRIPT\n' >$db_init_script
echo $'-- Initialize database and insert testdata\n' >>$db_init_script

cat ${db_data}/ddl/schemas.sql >>$db_init_script

echo $'\n-- Tables' >>$db_init_script
cat ${db_data}/ddl/utils.sql >>$db_init_script
cat ${db_data}/ddl/transactions.sql >>$db_init_script
cat ${db_data}/ddl/home.sql >>$db_init_script
cat ${db_data}/ddl/investments.sql >>$db_init_script
cat ${db_data}/ddl/work.sql >>$db_init_script

echo $'\n-- Testdata' >>$db_init_script
cat ${db_data}/testdata/utils.sql >>$db_init_script
cat ${db_data}/testdata/investments.sql >>$db_init_script

cmp --silent $db_init_script ${db_init_script}.bak
if [ $? == 0 ]; then
    rm ${db_init_script}.bak
else
    # TODO maybe introduce some versioning, if necessary
    echo "Warning: discovered changes in ${db_init_script}"
fi

# Create DB container (also creates a database and executes the generated init.sql script)
docker-compose -f ${db_root}/docker-compose.db.yml up -d
