-- -- utils
INSERT INTO utils.expense_types
    (type, description)
VALUES
    ('FOOD', NULL),
    ('HOUSEHOLD', 'Common tags: BigAmount, Repairs, Furniture'),
    ('TRANSPORTATION', 'Common tags: Fuel'),
    ('BEAUTY', 'Common tags: Hair'),
    ('LEISURE', NULL),
    (
        'VACATION',
        'Common tags: Accommodation, Transportation, Admission, Restaurant, Cafe&Bar, Groceries, Souvenir'
    );

INSERT INTO utils.income_types
    (type, description)
VALUES
    ('SALARY', NULL),
    ('PRIVATE_SALE', NULL);

INSERT INTO utils.tax_categories
    (category, description)
VALUES
    ('EINKOMMENSTEUER', NULL),
    ('VERMIETUNG_UND_VERPACHTUNG', NULL),
    ('WERBUNGSKOSTEN', NULL);

INSERT INTO utils.payment_methods
    (name, description)
VALUES
    ('TRANSFER', NULL),
    ('EC', NULL),
    ('CREDIT_CARD', NULL),
    ('CASH', NULL);

INSERT INTO utils.bank_accounts
    (account, bank, owner, type, annual_fee)
VALUES
    ('HOME_ACCOUNT', 'Bank Home', 'Ivanna', 'private', 0.0),
    ('WORK_ACCOUNT', 'Bank Work', 'Dmitriy', 'business', 9.99),
    ('INVESTMENT_ACCOUNT', 'Bank Inv', 'Dmitriy and Ivanna', 'investment', 0.0),
    ('CASH', 'Piggy bank', 'Dmitriy and Ivanna', 'private', 0.0);
