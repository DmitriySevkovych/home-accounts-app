-- Schemas
CREATE SCHEMA IF NOT EXISTS utils;
CREATE SCHEMA IF NOT EXISTS transactions;
CREATE SCHEMA IF NOT EXISTS home;
CREATE SCHEMA IF NOT EXISTS work;
CREATE SCHEMA IF NOT EXISTS investments;

-- Tables
---- utils

CREATE TABLE IF NOT EXISTS utils.expense_types (
    type character varying NOT NULL,
    description text
);

CREATE TABLE IF NOT EXISTS utils.income_types (
    type character varying NOT NULL,
    description text
);

-- Testdata
---- utils

INSERT INTO utils.expense_types (type, description)
VALUES
    ('FOOD', NULL),
    ('HOUSEHOLD', 'Common tags: BigAmount, Repairs, Furniture'),
    ('TRANSPORTATION', 'Common tags: Fuel'),
    ('BEAUTY', 'Common tags: Hair'),
    ('LEISURE', NULL),
    ('VACATION', 'Common tags: Accommodation, Transportation, Admission, Restaurant, Cafe&Bar, Groceries, Souvenir');


INSERT INTO utils.income_types (type, description)
VALUES
    ('SALARY', NULL),
    ('PRIVATE_SALE', NULL);

                
                
                
                
                