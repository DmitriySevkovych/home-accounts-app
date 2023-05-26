---- utils
CREATE TABLE IF NOT EXISTS
  utils.expense_types (
    type CHARACTER VARYING NOT NULL,
    description TEXT
  );

ALTER TABLE ONLY utils.expense_types
ADD CONSTRAINT u_expense_types_pkey PRIMARY KEY (
  type
);

--
CREATE TABLE IF NOT EXISTS
  utils.income_types (
    type CHARACTER VARYING NOT NULL,
    description TEXT
  );

ALTER TABLE ONLY utils.income_types
ADD CONSTRAINT income_types_pkey PRIMARY KEY (
  type
);

--
CREATE TABLE IF NOT EXISTS
  utils.tax_categories (
    category CHARACTER VARYING NOT NULL,
    description TEXT
  );

ALTER TABLE ONLY utils.tax_categories
ADD CONSTRAINT tax_categories_pkey PRIMARY KEY (category);

--
CREATE TABLE IF NOT EXISTS
  utils.payment_methods (name CHARACTER VARYING NOT NULL, description TEXT);

ALTER TABLE ONLY utils.payment_methods
ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (name);

--
CREATE TABLE IF NOT EXISTS
  utils.bank_accounts (
    account CHARACTER VARYING NOT NULL,
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

ALTER TABLE ONLY utils.bank_accounts
ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (account);
