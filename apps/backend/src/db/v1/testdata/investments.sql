-- -- investments
INSERT INTO
  investments.investment_types ("type")
VALUES
  ('REAL_ESTATE'),
  ('STOCKS'),
  ('CRAFT'),
  ('TANGIBLES');

INSERT INTO
  investments.investments (
    "key",
    "type",
    "description",
    "start_date",
    "end_date"
  )
VALUES
  (
    'Homebrew',
    'CRAFT',
    'Homebrewing hobby with business perspective',
    '2010-01-01',
    NULL
  ),
  (
    'Precious_Metals',
    'TANGIBLES',
    'Gold, gold coins, silver, etc.',
    '2010-02-02',
    NULL
  ),
  (
    'Stock_Portfolio',
    'STOCKS',
    'Stock portfolio.',
    '2010-03-03',
    '2010-04-04'
  ),
  (
    'Apartment',
    'REAL_ESTATE',
    '2/1 Apartment',
    '2010-05-05',
    NULL
  );
