---- transactions
CREATE TABLE IF NOT EXISTS
  transactions.transactions (
    id integer NOT NULL,
    date date NOT NULL,
    amount numeric(10, 2) NOT NULL,
    source_bank_account character varying,
    target_bank_account character varying,
    currency character varying,
    exchange_rate numeric,
    agent character varying NOT NULL
  );

-- ALTER TABLE transactions.transactions OWNER TO admin;
CREATE SEQUENCE transactions.transactions_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- ALTER TABLE transactions.transactions_id_seq OWNER TO admin;
ALTER SEQUENCE transactions.transactions_id_seq OWNED BY transactions.transactions.id;

ALTER TABLE ONLY transactions.transactions
ALTER COLUMN id
SET DEFAULT nextval('transactions.transactions_id_seq'::regclass);

ALTER TABLE ONLY transactions.transactions
ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);

--
CREATE TABLE IF NOT EXISTS
  transactions.transaction_details (
    id integer NOT NULL,
    transaction_id integer NOT NULL,
    tax_relevant boolean NOT NULL,
    tax_category character varying,
    payment_method character varying,
    comment text,
    receipt_id integer
  );

--ALTER TABLE transactions.transaction_details OWNER TO admin;
CREATE SEQUENCE transactions.transaction_details_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- ALTER TABLE transactions.transaction_details_id_seq OWNER TO admin;
ALTER SEQUENCE transactions.transaction_details_id_seq OWNED BY transactions.transaction_details.id;

ALTER TABLE ONLY transactions.transaction_details
ALTER COLUMN id
SET DEFAULT nextval(
  'transactions.transaction_details_id_seq'::regclass
);

ALTER TABLE ONLY transactions.transaction_details
ADD CONSTRAINT pk_transaction_details PRIMARY KEY (id);

ALTER TABLE ONLY transactions.transaction_details
ADD CONSTRAINT fk_transaction FOREIGN KEY (transaction_id) REFERENCES transactions.transactions (id) NOT VALID;

ALTER TABLE ONLY transactions.transaction_details
ADD CONSTRAINT fk_payment_method FOREIGN KEY (payment_method) REFERENCES utils.payment_methods (name) NOT VALID;

ALTER TABLE ONLY transactions.transaction_details
ADD CONSTRAINT fk_tax_category FOREIGN KEY (tax_category) REFERENCES utils.tax_categories (category) NOT VALID;

-- ALTER TABLE ONLY transactions.transaction_details
--     ADD CONSTRAINT fk_transaction_receipt_id FOREIGN KEY (receipt_id) REFERENCES transactions.transaction_receipts(id) NOT VALID;
