---- utils
--
CREATE TABLE IF NOT EXISTS utils.expense_types (
  type CHARACTER VARYING PRIMARY KEY,
  description TEXT
);

--
CREATE TABLE IF NOT EXISTS utils.income_types (
  type CHARACTER VARYING PRIMARY KEY,
  description TEXT
);

--
CREATE TABLE IF NOT EXISTS utils.tax_categories (
  category CHARACTER VARYING PRIMARY KEY,
  description TEXT
);

--
CREATE TABLE IF NOT EXISTS utils.payment_methods (
  name CHARACTER VARYING PRIMARY KEY,
  description TEXT
);

--
CREATE TABLE IF NOT EXISTS utils.payment_frequencies (frequency CHARACTER VARYING PRIMARY KEY);

--
CREATE TABLE IF NOT EXISTS utils.bank_accounts (
  account CHARACTER VARYING PRIMARY KEY,
  iban CHARACTER VARYING(27),
  bank CHARACTER VARYING NOT NULL,
  owner CHARACTER VARYING NOT NULL,
  type CHARACTER VARYING NOT NULL,
  annual_fee NUMERIC NOT NULL DEFAULT 0.0,
  purpose CHARACTER VARYING,
  contact CHARACTER VARYING,
  opening_date DATE,
  closing_date DATE,
  comment TEXT
);

--
CREATE TABLE IF NOT EXISTS utils.tags (tag character varying PRIMARY KEY);

--
CREATE TABLE utils.blueprint_types (
  "type" VARCHAR NOT NULL,
  "schema" VARCHAR NOT NULL,
  "table" VARCHAR NOT NULL,
  description VARCHAR,
  CONSTRAINT blueprint_types_pkey PRIMARY KEY (type)
);

--
CREATE TABLE IF NOT EXISTS utils.blueprints (
  "key" VARCHAR NOT NULL,
  "type" VARCHAR NOT NULL,
  frequency VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  due_day VARCHAR NOT NULL,
  expiration_date DATE,
  remind_date DATE,
  cancelation_period VARCHAR,
  last_update DATE NOT NULL,
  CONSTRAINT blueprints_pkey PRIMARY KEY (key),
  CONSTRAINT check_maturity CHECK (
    (
      (start_date IS NOT NULL)
      OR (due_day IS NOT NULL)
    )
  ),
  CONSTRAINT fk_blueprint_type FOREIGN KEY ("type") REFERENCES utils.blueprint_types ("type"),
  CONSTRAINT fk_frequency FOREIGN KEY (frequency) REFERENCES utils.payment_frequencies (frequency)
);

--
CREATE TABLE utils.blueprint_details (
  id SERIAL4 NOT NULL,
  blueprint_key VARCHAR NOT NULL,
  "type" VARCHAR NOT NULL,
  origin VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  additional_data JSONB,
  CONSTRAINT blueprint_details_pkey PRIMARY KEY (id),
  CONSTRAINT fk_blueprint FOREIGN KEY (blueprint_key) REFERENCES utils.blueprints ("key") ON UPDATE CASCADE
);

--
CREATE TABLE utils.blueprint_tags (
  id SERIAL4 NOT NULL,
  blueprint_key VARCHAR NOT NULL,
  tag VARCHAR NOT NULL,
  CONSTRAINT blueprint_tags_pkey PRIMARY KEY (id),
  CONSTRAINT u_no_duplicate_tag_per_blueprint UNIQUE (blueprint_key, tag),
  CONSTRAINT fk_blueprint_key FOREIGN KEY (blueprint_key) REFERENCES utils.blueprints ("key") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (tag) REFERENCES utils.tags (tag) ON DELETE CASCADE ON UPDATE CASCADE
);

--
CREATE TABLE utils.blueprint_transactions (
  id SERIAL4 NOT NULL,
  blueprint_key VARCHAR NOT NULL,
  amount NUMERIC NOT NULL,
  source_bank_account VARCHAR NULL,
  target_bank_account VARCHAR NULL,
  currency VARCHAR NOT NULL,
  tax_category VARCHAR,
  payment_method VARCHAR NOT NULL,
  "comment" VARCHAR,
  receipt_id INT4,
  CONSTRAINT blueprint_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT check_bank_accounts CHECK (
    (
      (source_bank_account IS NOT NULL)
      OR (target_bank_account IS NOT NULL)
    )
  ),
  CONSTRAINT fk_blueprints FOREIGN KEY (blueprint_key) REFERENCES utils.blueprints ("key") ON UPDATE CASCADE,
  CONSTRAINT fk_payment_method FOREIGN KEY (payment_method) REFERENCES utils.payment_methods ("name"),
  CONSTRAINT fk_source_bank_account FOREIGN KEY (source_bank_account) REFERENCES utils.bank_accounts (account),
  CONSTRAINT fk_target_bank_account FOREIGN KEY (target_bank_account) REFERENCES utils.bank_accounts (account),
  CONSTRAINT fk_tax_category FOREIGN KEY (tax_category) REFERENCES utils.tax_categories (category)
);
