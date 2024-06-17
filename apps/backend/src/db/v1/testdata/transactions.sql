-- -- transactions
INSERT INTO
  transactions.transaction_contexts (context)
VALUES
  ('home'),
  ('work'),
  ('investments');

INSERT INTO
  transactions.transaction_categories (
    category,
    context,
    can_be_expense,
    can_be_income,
    is_zerosum
  )
VALUES
  ('FOOD', 'home', TRUE, FALSE, FALSE),
  ('HOUSEHOLD', 'home', TRUE, FALSE, FALSE),
  ('FEE', 'home', TRUE, FALSE, FALSE),
  ('FEE', 'work', TRUE, FALSE, FALSE),
  ('FEE', 'investments', TRUE, FALSE, FALSE),
  ('MAINTENANCE', 'home', TRUE, FALSE, FALSE),
  ('MAINTENANCE', 'work', TRUE, FALSE, FALSE),
  ('MAINTENANCE', 'investments', TRUE, FALSE, FALSE),
  ('TAX', 'home', TRUE, FALSE, FALSE),
  ('TAX', 'work', TRUE, FALSE, FALSE),
  ('TAX', 'investments', TRUE, FALSE, FALSE),
  ('TRANSPORTATION', 'home', TRUE, FALSE, FALSE),
  ('TRANSPORTATION', 'work', TRUE, FALSE, FALSE),
  (
    'TRANSPORTATION',
    'investments',
    TRUE,
    FALSE,
    FALSE
  ),
  ('VACATION', 'home', TRUE, FALSE, FALSE),
  ('BEAUTY', 'home', TRUE, FALSE, FALSE),
  ('LEISURE', 'home', TRUE, FALSE, FALSE),
  ('SALARY', 'home', FALSE, TRUE, FALSE),
  ('SALARY', 'work', TRUE, TRUE, FALSE),
  ('PRIVATE_SALE', 'home', FALSE, TRUE, FALSE),
  ('RENT', 'home', TRUE, FALSE, FALSE),
  ('RENT', 'work', TRUE, FALSE, FALSE),
  ('RENT', 'investments', FALSE, TRUE, FALSE),
  ('GIFT', 'home', TRUE, TRUE, FALSE),
  ('CURRENCY_EXCHANGE', 'home', FALSE, FALSE, TRUE),
  ('CASH_WITHDRAWAL', 'home', FALSE, FALSE, TRUE);
