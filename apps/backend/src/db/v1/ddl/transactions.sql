---- transactions
--
CREATE TABLE IF NOT EXISTS transactions.transaction_contexts (
  context VARCHAR NOT NULL,
  CONSTRAINT transaction_contexts_pk PRIMARY KEY (context)
);

--
CREATE TABLE transactions.transaction_categories (
  category VARCHAR NOT NULL,
  context VARCHAR NOT NULL,
  can_be_expense BOOLEAN,
  can_be_income BOOLEAN,
  can_be_zerosum BOOLEAN,
  CONSTRAINT transaction_categories_pk PRIMARY KEY (category, context),
  CONSTRAINT transaction_categories_fk FOREIGN KEY (context) REFERENCES transactions.transaction_contexts (context) ON UPDATE CASCADE
);

--
CREATE TABLE IF NOT EXISTS transactions.transaction_receipts (
  id integer PRIMARY KEY,
  name varchar NOT NULL,
  mimetype varchar NOT NULL,
  buffer bytea NOT NULL
);

CREATE SEQUENCE transactions.transaction_receipts_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE transactions.transaction_receipts_id_seq OWNED BY transactions.transaction_receipts.id;

ALTER TABLE ONLY transactions.transaction_receipts
ALTER COLUMN id
SET DEFAULT nextval(
  'transactions.transaction_receipts_id_seq'::regclass
);

--
CREATE TABLE IF NOT EXISTS transactions.transactions (
  id integer PRIMARY KEY,
  context varchar NOT NULL,
  category varchar NOT NULL,
  origin varchar NOT NULL,
  description varchar,
  date date NOT NULL,
  amount numeric(10, 2) NOT NULL,
  source_bank_account varchar,
  target_bank_account varchar,
  currency varchar,
  exchange_rate numeric,
  tax_category varchar REFERENCES utils.tax_categories (category),
  payment_method varchar REFERENCES utils.payment_methods (name),
  comment text,
  agent varchar NOT NULL,
  receipt_id integer NULL,
  CONSTRAINT fk_source_bank_account FOREIGN KEY (source_bank_account) REFERENCES utils.bank_accounts (account) ON UPDATE CASCADE,
  CONSTRAINT fk_target_bank_account FOREIGN KEY (target_bank_account) REFERENCES utils.bank_accounts (account) ON UPDATE CASCADE,
  CONSTRAINT fk_transaction_receipt FOREIGN KEY (receipt_id) REFERENCES transactions.transaction_receipts (id) ON DELETE SET NULL,
  CONSTRAINT fk_transaction_category_and_context FOREIGN KEY (category, context) REFERENCES transactions.transaction_categories (category, context) ON UPDATE CASCADE
);

CREATE SEQUENCE transactions.transactions_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE transactions.transactions_id_seq OWNED BY transactions.transactions.id;

ALTER TABLE ONLY transactions.transactions
ALTER COLUMN id
SET DEFAULT nextval('transactions.transactions_id_seq'::regclass);

CREATE INDEX idx_transactions_origins ON transactions.transactions (UPPER(origin));

CREATE INDEX idx_transactions_descriptions ON transactions.transactions (UPPER("description"));

CREATE INDEX idx_transactions_dates ON transactions.transactions ("date");

--
CREATE TABLE transactions.transaction_tags (
  id serial NOT NULL,
  transaction_id integer NOT NULL,
  tag varchar NOT NULL,
  CONSTRAINT transaction_tags_pk PRIMARY KEY (id),
  CONSTRAINT transaction_tags_fk FOREIGN KEY (transaction_id) REFERENCES transactions.transactions (id) ON DELETE CASCADE,
  CONSTRAINT transaction_tags_fk_1 FOREIGN KEY (tag) REFERENCES utils.tags (tag) ON DELETE CASCADE ON UPDATE CASCADE
);
