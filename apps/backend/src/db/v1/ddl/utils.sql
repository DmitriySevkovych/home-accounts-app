---- utils
CREATE TABLE IF NOT EXISTS utils.expense_types (
    type character varying NOT NULL,
    description text
);

CREATE TABLE IF NOT EXISTS utils.income_types (
    type character varying NOT NULL,
    description text
);
