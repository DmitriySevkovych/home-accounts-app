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
CREATE TABLE IF NOT EXISTS utils.payment_frequencies (
  frequency CHARACTER VARYING PRIMARY KEY,
  step INTEGER NOT NULL,
  times_per_year INTEGER NOT NULL
);

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
