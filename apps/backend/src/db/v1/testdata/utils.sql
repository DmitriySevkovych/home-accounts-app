---- utils
INSERT INTO utils.expense_types (type, description)
VALUES
    ('FOOD', NULL),
    ('HOUSEHOLD', 'Common tags: BigAmount, Repairs, Furniture'),
    ('TRANSPORTATION', 'Common tags: Fuel'),
    ('BEAUTY', 'Common tags: Hair'),
    ('LEISURE', NULL),
    ('VACATION', 'Common tags: Accommodation, Transportation, Admission, Restaurant, Cafe&Bar, Groceries, Souvenir');


INSERT INTO utils.income_types (type, description)
VALUES
    ('SALARY', NULL),
    ('PRIVATE_SALE', NULL);