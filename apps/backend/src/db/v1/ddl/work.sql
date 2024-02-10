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

-- project invoice transactions
CREATE TABLE work.project_invoice_transactions (
  id integer PRIMARY KEY,
  invoice varchar NOT NULL,
  transaction_id integer UNIQUE NOT NULL,
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

-- vat tax
CREATE TABLE work.transaction_vat (
  id serial PRIMARY KEY,
  transaction_id integer UNIQUE NOT NULL REFERENCES transactions.transactions (id) ON DELETE CASCADE,
  vat numeric,
  country varchar(2)
);
