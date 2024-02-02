---- investments
CREATE TABLE investments.investment_types ("type" varchar NOT NULL PRIMARY KEY);

CREATE TABLE investments.investments (
  "key" varchar NOT NULL PRIMARY KEY,
  description varchar NOT NULL,
  "type" varchar NOT NULL REFERENCES investments.investment_types ("type"),
  start_date date NOT NULL,
  end_date date NULL
);

-- investment_transactions 
CREATE TABLE investments.investment_transactions (
  id serial PRIMARY KEY,
  investment varchar NOT NULL REFERENCES investments.investments ("key"),
  transaction_id integer UNIQUE NOT NULL REFERENCES transactions.transactions (id)
);
