---- investments
CREATE TABLE investments.investment_types ("type" varchar NOT NULL PRIMARY KEY);

CREATE TABLE investments.investments (
  "key" varchar NOT NULL PRIMARY KEY,
  description varchar NOT NULL,
  "type" varchar NOT NULL REFERENCES investments.investment_types ("type"),
  start_date date NOT NULL,
  end_date date NULL
);

-- expenses 
CREATE TABLE investments.expenses (
  id integer PRIMARY KEY,
  investment varchar NOT NULL REFERENCES investments.investments ("key"),
  type character varying NOT NULL,
  origin character varying NOT NULL,
  description character varying,
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id)
);

CREATE SEQUENCE investments.expenses_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE investments.expenses_id_seq OWNED BY investments.expenses.id;

ALTER TABLE ONLY investments.expenses
ALTER COLUMN id
SET DEFAULT nextval('investments.expenses_id_seq'::regclass);

-- income
CREATE TABLE investments.income (
  id integer PRIMARY KEY,
  investment varchar NOT NULL REFERENCES investments.investments ("key"),
  type character varying NOT NULL,
  origin character varying NOT NULL,
  description character varying,
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id)
);

CREATE SEQUENCE investments.income_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE investments.income_id_seq OWNED BY investments.income.id;

ALTER TABLE ONLY investments.income
ALTER COLUMN id
SET DEFAULT nextval('investments.income_id_seq'::regclass);
