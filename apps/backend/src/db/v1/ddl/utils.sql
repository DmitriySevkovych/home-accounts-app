---- utils
CREATE TABLE IF NOT EXISTS utils.expense_types (
    type character varying NOT NULL,
    description text
);

CREATE TABLE IF NOT EXISTS utils.income_types (
    type character varying NOT NULL,
    description text
);

CREATE TABLE IF NOT EXISTS utils.tax_categories (
    category character varying NOT NULL,
    description text
);

CREATE TABLE IF NOT EXISTS utils.payment_methods (
    name character varying NOT NULL,
    description text
);

CREATE TABLE IF NOT EXISTS utils.bank_accounts (
    account character varying NOT NULL,
    bank character varying NOT NULL,
    owner character varying NOT NULL,
    type character varying NOT NULL,
    annual_fee numeric NOT NULL DEFAULT 0.0, 
    purpose character varying,
    iban character varying,
    contact character varying,
    opening_date date,
    closing_date date,
    comment text
);
