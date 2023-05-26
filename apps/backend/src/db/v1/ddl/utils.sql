-- -- utils
CREATE TABLE IF NOT EXISTS utils.expense_types (
    type CHARACTER VARYING NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS utils.income_types (
    type CHARACTER VARYING NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS utils.tax_categories (
    category CHARACTER VARYING NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS utils.payment_methods (
    name CHARACTER VARYING NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS utils.bank_accounts (
    account CHARACTER VARYING NOT NULL,
    bank CHARACTER VARYING NOT NULL,
    owner CHARACTER VARYING NOT NULL,
    type CHARACTER VARYING NOT NULL,
    annual_fee NUMERIC NOT NULL DEFAULT 0.0,
    purpose CHARACTER VARYING,
    iban CHARACTER VARYING,
    contact CHARACTER VARYING,
    opening_date DATE,
    closing_date DATE,
    comment TEXT
);
