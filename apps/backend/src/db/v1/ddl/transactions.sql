---- transactions
--
CREATE TABLE IF NOT EXISTS transactions.transactions (
  id integer PRIMARY KEY,
  context varchar NOT NULL,
  date date NOT NULL,
  amount numeric(10, 2) NOT NULL,
  source_bank_account varchar,
  target_bank_account varchar,
  currency varchar,
  exchange_rate numeric,
  agent varchar NOT NULL,
  CONSTRAINT fk_source_bank_account FOREIGN KEY (source_bank_account) REFERENCES utils.bank_accounts(account) ON UPDATE CASCADE,
	CONSTRAINT fk_target_bank_account FOREIGN KEY (target_bank_account) REFERENCES utils.bank_accounts(account) ON UPDATE CASCADE
);

CREATE SEQUENCE transactions.transactions_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE transactions.transactions_id_seq OWNED BY transactions.transactions.id;

ALTER TABLE ONLY transactions.transactions
ALTER COLUMN id
SET DEFAULT nextval('transactions.transactions_id_seq'::regclass);

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
CREATE TABLE IF NOT EXISTS transactions.transaction_details (
  id integer PRIMARY KEY,
  transaction_id integer NOT NULL REFERENCES transactions.transactions (id),
  tax_category varchar REFERENCES utils.tax_categories (category),
  payment_method varchar REFERENCES utils.payment_methods (name),
  comment text,
  receipt_id integer REFERENCES transactions.transaction_receipts (id)
);

CREATE SEQUENCE transactions.transaction_details_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE transactions.transaction_details_id_seq OWNED BY transactions.transaction_details.id;

ALTER TABLE ONLY transactions.transaction_details
ALTER COLUMN id
SET DEFAULT nextval(
  'transactions.transaction_details_id_seq'::regclass
);
