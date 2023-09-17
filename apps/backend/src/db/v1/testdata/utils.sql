-- -- utils
INSERT INTO
  utils.expense_types (
    type,
    description
  )
VALUES
  ('FOOD', NULL),
  (
    'HOUSEHOLD',
    'Common tags: BigAmount, Repairs, Furniture'
  ),
  ('TRANSPORTATION', 'Common tags: Fuel'),
  ('BEAUTY', 'Common tags: Hair'),
  ('LEISURE', NULL),
  (
    'VACATION',
    'Common tags: Accommodation, Transportation, Admission, Restaurant, Cafe&Bar, Groceries, Souvenir'
  ),
  ('SALARY', NULL),
  ('GIFT', NULL);

INSERT INTO
  utils.income_types (
    type,
    description
  )
VALUES
  ('SALARY', NULL),
  ('PRIVATE_SALE', NULL),
  ('GIFT', NULL);

INSERT INTO
  utils.tax_categories (category, description)
VALUES
  ('EINKOMMENSTEUER', NULL),
  ('VERMIETUNG_UND_VERPACHTUNG', NULL),
  ('WERBUNGSKOSTEN', NULL);

INSERT INTO
  utils.payment_methods (name, description)
VALUES
  ('TRANSFER', NULL),
  ('EC', NULL),
  ('CREDIT_CARD', NULL),
  ('CASH', NULL);

INSERT INTO
  utils.bank_accounts (
    account,
    bank,
    owner,
    type,
    annual_fee
  )
VALUES
  (
    'HOME_ACCOUNT',
    'Bank Home',
    'Ivanna',
    'private',
    0.0
  ),
  (
    'WORK_ACCOUNT',
    'Bank Work',
    'Dmitriy',
    'business',
    9.99
  ),
  (
    'INVESTMENT_ACCOUNT',
    'Bank Inv',
    'Dmitriy and Ivanna',
    'investment',
    0.0
  ),
  (
    'CASH',
    'Piggy bank',
    'Dmitriy and Ivanna',
    'private',
    0.0
  );

INSERT INTO
  utils.tags (tag)
VALUES
  ('Tag1'),
  ('Tag2'),
  ('Tag3'),
  ('Tag4'),
  ('Tag5'),
  ('Tag6'),
  ('Tag7'),
  ('Tag8'),
  ('Tag9'),
  ('Tag10'),
  ('Coffee'),
  ('Cafe&Bar'),
  ('Electronics'),
  ('Cosmetics'),
  ('Haircare'),
  ('Skincare');
