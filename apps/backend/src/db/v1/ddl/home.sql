---- home
CREATE TABLE home.expenses (
    id integer NOT NULL,
    type character varying NOT NULL,
    origin character varying NOT NULL,
    description character varying,
    transaction_id integer NOT NULL
);

ALTER TABLE ONLY home.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY home.expenses
    ADD CONSTRAINT fk_expense_types FOREIGN KEY (type) REFERENCES utils.expense_types(type);

ALTER TABLE ONLY home.expenses
    ADD CONSTRAINT fk_transaction_id FOREIGN KEY (transaction_id) REFERENCES transactions.transactions(id);

CREATE SEQUENCE home.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE home.expenses_id_seq OWNED BY home.expenses.id;

ALTER TABLE ONLY home.expenses ALTER COLUMN id SET DEFAULT nextval('home.expenses_id_seq'::regclass);

--

CREATE TABLE home.income (
    type character varying NOT NULL,
    origin character varying NOT NULL,
    description character varying,
    transaction_id integer NOT NULL,
    id integer NOT NULL
);

ALTER TABLE ONLY home.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (id);

ALTER TABLE ONLY home.income
    ADD CONSTRAINT fk_income_type FOREIGN KEY (type) REFERENCES utils.income_types(type);

ALTER TABLE ONLY home.income
    ADD CONSTRAINT fk_transaction_id FOREIGN KEY (transaction_id) REFERENCES transactions.transactions(id);

CREATE SEQUENCE home.income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE home.income_id_seq OWNED BY home.income.id;

ALTER TABLE ONLY home.income ALTER COLUMN id SET DEFAULT nextval('home.income_id_seq'::regclass);
