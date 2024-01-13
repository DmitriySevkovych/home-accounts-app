-- -- utils
INSERT INTO
  utils.expense_types (type, description)
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
  ('MAINTENANCE', NULL),
  ('TAX', NULL),
  ('FEE', NULL),
  ('GIFT', NULL);

INSERT INTO
  utils.income_types (type, description)
VALUES
  ('SALARY', NULL),
  ('PRIVATE_SALE', NULL),
  ('RENT', NULL),
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
  ('CASH', NULL),
  ('SEPA', NULL);

INSERT INTO
  utils.payment_frequencies (frequency, step, times_per_year)
VALUES
  ('MONTHLY', 1, 12),
  ('ANNUALLY', 12, 1),
  ('SEMI-ANUALLY', 6, 2),
  ('QUARTERLY', 3, 4),
  ('ONE-TIME', 1, 0),
  ('WEEKLY', 1, 52);

INSERT INTO
  utils.bank_accounts (
    account,
    bank,
    owner,
    type,
    annual_fee,
    opening_date,
    closing_date
  )
VALUES
  (
    'HOME_ACCOUNT',
    'Bank Home',
    'Ivanna',
    'private',
    0.0,
    NULL,
    NULL
  ),
  (
    'WORK_ACCOUNT',
    'Bank Work',
    'Dmitriy',
    'business',
    9.99,
    NULL,
    NULL
  ),
  (
    'INVESTMENT_ACCOUNT',
    'Bank Inv',
    'Dmitriy and Ivanna',
    'investment',
    0.0,
    NULL,
    NULL
  ),
  (
    'CASH',
    'Piggy bank',
    'Dmitriy and Ivanna',
    'private',
    0.0,
    NULL,
    NULL
  ),
  (
    'OLD_ACCOUNT',
    'Old, inactive account',
    'Dmitriy and Ivanna',
    'private',
    0.0,
    '2000-01-01',
    '2020-12-31'
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

INSERT INTO
  utils.blueprint_types ("type", "schema", "table")
VALUES
  ('HOME_INCOME', 'home', 'income'),
  ('WORK_INCOME', 'work', 'income'),
  ('INVESTMENT_INCOME', 'investments', 'income'),
  ('HOME_EXPENSE', 'home', 'expenses'),
  ('WORK_EXPENSE', 'work', 'expenses'),
  ('INVESTMENT_EXPENSE', 'investments', 'expenses');

INSERT INTO
  utils.blueprints (
    "key",
    "type",
    frequency,
    "start_date",
    due_day,
    expiration_date,
    remind_date,
    cancelation_period,
    last_update
  )
VALUES
  (
    'BP_HOME_1',
    'HOME_EXPENSE',
    'MONTHLY',
    '2023-01-01',
    'LAST DAY',
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_HOME_2',
    'HOME_EXPENSE',
    'MONTHLY',
    '2023-02-03',
    3,
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_HOME_3',
    'HOME_EXPENSE',
    'WEEKLY',
    '2023-04-01',
    'FRIDAY',
    '2023-10-01',
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_HOME_4',
    'HOME_INCOME',
    'MONTHLY',
    '2023-01-01',
    30,
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_HOME_5_EXPIRED',
    'HOME_EXPENSE',
    'MONTHLY',
    '2023-01-01',
    10,
    '2023-12-31',
    null,
    null,
    '2023-12-31'
  ),
  (
    'BP_WORK_1',
    'WORK_EXPENSE',
    'ANNUALLY',
    '2023-08-15',
    15,
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_WORK_2',
    'WORK_EXPENSE',
    'QUARTERLY',
    '2023-02-15',
    15,
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_WORK_3',
    'WORK_INCOME',
    'MONTHLY',
    '2023-07-01',
    1,
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_INV_1',
    'INVESTMENT_EXPENSE',
    'MONTHLY',
    '2023-02-04',
    10,
    null,
    null,
    null,
    '2023-01-01'
  ),
  (
    'BP_INV_2',
    'INVESTMENT_INCOME',
    'MONTHLY',
    '2023-02-03',
    'LAST DAY',
    null,
    null,
    null,
    '2023-01-01'
  );

INSERT INTO
  utils.blueprint_details (
    blueprint_key,
    "type",
    origin,
    "description",
    additional_data
  )
VALUES
  ('BP_HOME_1', 'FEE', 'Landlord', 'Rent', null),
  (
    'BP_HOME_2',
    'FEE',
    'Electricity company',
    'Electricity bill',
    null
  ),
  (
    'BP_HOME_3',
    'BEAUTY',
    'Sports club',
    'Subscription',
    null
  ),
  (
    'BP_HOME_4',
    'SALARY',
    'Some enterprise',
    'Salary',
    null
  ),
  (
    'BP_HOME_5_EXPIRED',
    'FEE',
    'Gas enterprise',
    'Gas bill',
    null
  ),
  (
    'BP_WORK_1',
    'FEE',
    'Microsoft',
    'Office license',
    '{ "vat": 0.19, "country": "DE" }'
  ),
  (
    'BP_WORK_2',
    'TAX',
    'Government',
    'Income tax prepayment',
    '{ "vat": 0, "country": "DE" }'
  ),
  (
    'BP_WORK_3',
    'SALARY',
    'Customer',
    'Some amount payable in instalments',
    '{ "invoice_key": "INV-0123456" }'
  ),
  (
    'BP_INV_1',
    'MAINTENANCE',
    'Caretaker business',
    'Maintenance works',
    '{ "investment": "Apartment" }'
  ),
  (
    'BP_INV_2',
    'RENT',
    'Apartment',
    'Rent payment',
    '{ "investment": "Apartment" }'
  );

INSERT INTO
  utils.blueprint_transactions (
    blueprint_key,
    amount,
    source_bank_account,
    target_bank_account,
    currency,
    tax_category,
    payment_method,
    comment
  )
VALUES
  (
    'BP_HOME_1',
    -10.31,
    'HOME_ACCOUNT',
    null,
    'EUR',
    null,
    'TRANSFER',
    null
  ),
  (
    'BP_HOME_2',
    -10.32,
    'HOME_ACCOUNT',
    null,
    'EUR',
    null,
    'SEPA',
    null
  ),
  (
    'BP_HOME_3',
    -10.33,
    'HOME_ACCOUNT',
    null,
    'EUR',
    null,
    'CREDIT_CARD',
    null
  ),
  (
    'BP_HOME_4',
    10.34,
    null,
    'HOME_ACCOUNT',
    'EUR',
    null,
    'TRANSFER',
    'Not the same as work salary... actually a useless comment'
  ),
  (
    'BP_HOME_5_EXPIRED',
    -10.35,
    'HOME_ACCOUNT',
    null,
    'EUR',
    null,
    'TRANSFER',
    null
  ),
  (
    'BP_WORK_1',
    -110.31,
    'WORK_ACCOUNT',
    null,
    'EUR',
    'EINKOMMENSTEUER',
    'CREDIT_CARD',
    null
  ),
  (
    'BP_WORK_2',
    -110.32,
    'WORK_ACCOUNT',
    null,
    'EUR',
    'EINKOMMENSTEUER',
    'SEPA',
    null
  ),
  (
    'BP_WORK_3',
    110.33,
    null,
    'WORK_ACCOUNT',
    'EUR',
    'EINKOMMENSTEUER',
    'TRANSFER',
    'Not sure if work income will ever be a real use case'
  ),
  (
    'BP_INV_1',
    -1110.31,
    'INVESTMENT_ACCOUNT',
    null,
    'EUR',
    'VERMIETUNG_UND_VERPACHTUNG',
    'TRANSFER',
    null
  ),
  (
    'BP_INV_2',
    1110.32,
    null,
    'INVESTMENT_ACCOUNT',
    'EUR',
    'VERMIETUNG_UND_VERPACHTUNG',
    'TRANSFER',
    null
  );

INSERT INTO
  utils.blueprint_tags (blueprint_key, tag)
VALUES
  ('BP_HOME_1', 'Tag1'),
  ('BP_HOME_1', 'Tag2'),
  ('BP_WORK_1', 'Tag3'),
  ('BP_INV_1', 'Tag4');
