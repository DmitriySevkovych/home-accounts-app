-- -- transactions
INSERT INTO
  transactions.transaction_contexts (context)
VALUES
  ('home'),
  ('work'),
  ('investments');

INSERT INTO
  transactions.transaction_categories (category, context, can_be_expense, can_be_income)
VALUES
  ('FOOD', 'home', TRUE, FALSE),
  ('HOUSEHOLD', 'home', TRUE, FALSE),
  ('FEE', 'home', TRUE, FALSE),
  ('FEE', 'work', TRUE, FALSE),
  ('FEE', 'investments', TRUE, FALSE),
  ('MAINTENANCE', 'home', TRUE, FALSE),
  ('MAINTENANCE', 'work', TRUE, FALSE),
  ('MAINTENANCE', 'investments', TRUE, FALSE),
  ('TAX', 'home', TRUE, FALSE),
  ('TAX', 'work', TRUE, FALSE),
  ('TAX', 'investments', TRUE, FALSE),
  ('TRANSPORTATION', 'home', TRUE, FALSE),
  ('TRANSPORTATION', 'work', TRUE, FALSE),
  ('TRANSPORTATION', 'investments', TRUE, FALSE),
  ('VACATION', 'home', TRUE, FALSE),
  ('BEAUTY', 'home', TRUE, FALSE),
  ('LEISURE', 'home', TRUE, FALSE),
  ('SALARY', 'home', FALSE, TRUE),
  ('SALARY', 'work', TRUE, TRUE),
  ('PRIVATE_SALE', 'home', FALSE, TRUE),
  ('RENT', 'home', TRUE, FALSE),
  ('RENT', 'work', TRUE, FALSE),
  ('RENT', 'investments', FALSE, TRUE),
  ('GIFT', 'home', TRUE, TRUE);
