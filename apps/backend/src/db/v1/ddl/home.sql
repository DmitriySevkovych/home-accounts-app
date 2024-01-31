---- home
-- expenses 
CREATE TABLE home.expenses (
  id integer PRIMARY KEY,
  type character varying NOT NULL,
  origin character varying NOT NULL,
  description character varying,
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id)
);

CREATE SEQUENCE home.expenses_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE home.expenses_id_seq OWNED BY home.expenses.id;

ALTER TABLE ONLY home.expenses
ALTER COLUMN id
SET DEFAULT nextval('home.expenses_id_seq'::regclass);

-- income
CREATE TABLE home.income (
  id integer PRIMARY KEY,
  type character varying NOT NULL,
  origin character varying NOT NULL,
  description character varying,
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id)
);

CREATE SEQUENCE home.income_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE home.income_id_seq OWNED BY home.income.id;

ALTER TABLE ONLY home.income
ALTER COLUMN id
SET DEFAULT nextval('home.income_id_seq'::regclass);
