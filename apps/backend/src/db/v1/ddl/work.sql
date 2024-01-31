---- work
-- projects
CREATE TABLE work.projects (
  "key" varchar NOT NULL PRIMARY KEY,
  customer varchar NOT NULL,
  start_date date NOT NULL,
  end_date date NULL,
  "location" varchar NULL,
  hourly_rate numeric NULL,
  flat_price numeric NULL,
  recruiter varchar NULL,
  "comment" text NULL,
  contract bytea NULL,
  proposal varchar NULL,
  planned_volume varchar NOT NULL,
  contact_person varchar NULL
  --CONSTRAINT fk_customer FOREIGN KEY (customer) REFERENCES work.customers("key"),
  --CONSTRAINT fk_project_proposal FOREIGN KEY (proposal) REFERENCES work.project_proposals("key"),
  --CONSTRAINT fk_recruiter FOREIGN KEY (recruiter) REFERENCES work.recruiters("key")
);

-- project invoices
CREATE TABLE work.project_invoices (
  "key" varchar NOT NULL PRIMARY KEY,
  "date" date NOT NULL,
  due_date date NOT NULL,
  project varchar NOT NULL REFERENCES work.projects ("key"),
  net_amount numeric NOT NULL,
  vat numeric NOT NULL,
  discount numeric NOT NULL,
  status varchar NOT NULL,
  "comment" text NULL
);

-- project invoice transactions (REM: redundant after the introduction of the income table)
CREATE TABLE work.project_invoice_transactions (
  id integer PRIMARY KEY,
  invoice varchar NOT NULL,
  transaction_id integer NOT NULL,
  CONSTRAINT fk_invoice FOREIGN KEY (invoice) REFERENCES "work".project_invoices ("key"),
  CONSTRAINT fk_transaction_id FOREIGN KEY (transaction_id) REFERENCES transactions.transactions (id)
);

CREATE SEQUENCE work.project_invoice_transactions_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE work.project_invoice_transactions_id_seq OWNED BY work.project_invoice_transactions.id;

ALTER TABLE ONLY work.project_invoice_transactions
ALTER COLUMN id
SET DEFAULT nextval(
  'work.project_invoice_transactions_id_seq'::regclass
);

-- expenses 
CREATE TABLE work.expenses (
  id integer PRIMARY KEY,
  type varchar NOT NULL,
  origin varchar NOT NULL,
  description varchar,
  vat numeric,
  country varchar(2),
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id)
);

CREATE SEQUENCE work.expenses_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE work.expenses_id_seq OWNED BY work.expenses.id;

ALTER TABLE ONLY work.expenses
ALTER COLUMN id
SET DEFAULT nextval('work.expenses_id_seq'::regclass);

-- income
CREATE TABLE work.income (
  id integer PRIMARY KEY,
  type varchar NOT NULL,
  origin varchar NOT NULL,
  description varchar NOT NULL,
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id),
  invoice_key varchar NOT NULL REFERENCES work.project_invoices (key)
);

CREATE SEQUENCE work.income_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE work.income_id_seq OWNED BY work.income.id;

ALTER TABLE ONLY work.income
ALTER COLUMN id
SET DEFAULT nextval('work.income_id_seq'::regclass);
