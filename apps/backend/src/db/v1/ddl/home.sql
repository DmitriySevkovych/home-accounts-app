---- home
-- expenses 
CREATE TABLE home.expenses (
    id integer PRIMARY KEY,
    type character varying NOT NULL REFERENCES utils.expense_types(type),
    origin character varying NOT NULL,
    description character varying,
    transaction_id integer NOT NULL REFERENCES transactions.transactions(id)
);

CREATE SEQUENCE home.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE home.expenses_id_seq OWNED BY home.expenses.id;

ALTER TABLE ONLY home.expenses ALTER COLUMN id SET DEFAULT nextval('home.expenses_id_seq'::regclass);



-- expense tags
CREATE TABLE home.tags2expenses (
    id integer PRIMARY KEY,
    expense_id integer NOT NULL REFERENCES home.expenses(id) ON DELETE CASCADE,
    tag character varying NOT NULL REFERENCES utils.tags(tag) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE SEQUENCE home.tags2expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE home.tags2expenses_id_seq OWNED BY home.tags2expenses.id;

ALTER TABLE ONLY home.tags2expenses ALTER COLUMN id SET DEFAULT nextval('home.tags2expenses_id_seq'::regclass);



-- income
CREATE TABLE home.income (
    id integer PRIMARY KEY,
    type character varying NOT NULL REFERENCES utils.income_types(type),
    origin character varying NOT NULL,
    description character varying,
    transaction_id integer NOT NULL REFERENCES transactions.transactions(id)
);

CREATE SEQUENCE home.income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE home.income_id_seq OWNED BY home.income.id;

ALTER TABLE ONLY home.income ALTER COLUMN id SET DEFAULT nextval('home.income_id_seq'::regclass);



-- income tags
CREATE TABLE home.tags2income (
    id integer PRIMARY KEY,
    income_id integer NOT NULL REFERENCES home.income(id) ON DELETE CASCADE,
    tag character varying NOT NULL REFERENCES utils.tags(tag) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE SEQUENCE home.tags2income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE home.tags2income_id_seq OWNED BY home.tags2income.id;

ALTER TABLE ONLY home.tags2income ALTER COLUMN id SET DEFAULT nextval('home.tags2income_id_seq'::regclass);